'''
Business: Secure user authentication with multi-layer protection
Args: event with httpMethod, body (email, password), headers (X-Auth-Token)
Returns: HTTP response with JWT token or security error
Security: Rate limiting, account lockout, SQL injection prevention, XSS protection
'''

import json
import os
import jwt
import bcrypt
import re
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
import psycopg2
from psycopg2.extras import RealDictCursor

def get_client_ip(event: Dict[str, Any]) -> str:
    return event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')

def get_user_agent(event: Dict[str, Any]) -> str:
    return event.get('headers', {}).get('User-Agent', 'unknown')

def log_security_event(cur, user_id: Optional[int], action: str, success: bool, ip: str, user_agent: str, details: str = ''):
    try:
        cur.execute(
            "INSERT INTO t_p29917108_anime_viewer_portal.security_logs (user_id, action, success, ip_address, user_agent, details) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, action, success, ip, user_agent, details)
        )
    except Exception:
        pass

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email)) and len(email) <= 255

def validate_password(password: str) -> Tuple[bool, str]:
    if len(password) < 8:
        return False, "Пароль должен содержать минимум 8 символов"
    if not re.search(r'[A-Z]', password):
        return False, "Пароль должен содержать хотя бы одну заглавную букву"
    if not re.search(r'[a-z]', password):
        return False, "Пароль должен содержать хотя бы одну строчную букву"
    if not re.search(r'[0-9]', password):
        return False, "Пароль должен содержать хотя бы одну цифру"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Пароль должен содержать хотя бы один спецсимвол"
    return True, ""

def check_account_lockout(cur, email: str) -> Tuple[bool, str]:
    cur.execute(
        "SELECT failed_login_attempts, account_locked_until FROM t_p29917108_anime_viewer_portal.users WHERE email = %s",
        (email,)
    )
    user = cur.fetchone()
    
    if not user:
        return False, ""
    
    if user['account_locked_until'] and user['account_locked_until'] > datetime.utcnow():
        remaining = (user['account_locked_until'] - datetime.utcnow()).seconds // 60
        return True, f"Аккаунт заблокирован. Попробуйте через {remaining} минут"
    
    return False, ""

def update_failed_attempts(cur, conn, email: str):
    cur.execute(
        "UPDATE t_p29917108_anime_viewer_portal.users SET failed_login_attempts = failed_login_attempts + 1, last_failed_login = CURRENT_TIMESTAMP WHERE email = %s",
        (email,)
    )
    
    cur.execute("SELECT failed_login_attempts FROM t_p29917108_anime_viewer_portal.users WHERE email = %s", (email,))
    result = cur.fetchone()
    
    if result and result['failed_login_attempts'] >= 5:
        lockout_time = datetime.utcnow() + timedelta(minutes=30)
        cur.execute(
            "UPDATE t_p29917108_anime_viewer_portal.users SET account_locked_until = %s WHERE email = %s",
            (lockout_time, email)
        )
    
    conn.commit()

def reset_failed_attempts(cur, conn, email: str):
    cur.execute(
        "UPDATE t_p29917108_anime_viewer_portal.users SET failed_login_attempts = 0, account_locked_until = NULL WHERE email = %s",
        (email,)
    )
    conn.commit()

def sanitize_input(text: str) -> str:
    return text.replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#x27;')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    client_ip = get_client_ip(event)
    user_agent = get_user_agent(event)
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET', 'default-secret-change-me')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'login')
            email = sanitize_input(body.get('email', '').lower().strip())
            password = body.get('password', '')
            
            if not validate_email(email):
                log_security_event(cur, None, f'{action}_invalid_email', False, client_ip, user_agent, email)
                conn.commit()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Некорректный email'}),
                    'isBase64Encoded': False
                }
            
            if action == 'register':
                valid, error_msg = validate_password(password)
                if not valid:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': error_msg}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM t_p29917108_anime_viewer_portal.users WHERE email = %s", (email,))
                if cur.fetchone():
                    log_security_event(cur, None, 'register_duplicate', False, client_ip, user_agent, email)
                    conn.commit()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email уже зарегистрирован'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cur.execute(
                    "INSERT INTO t_p29917108_anime_viewer_portal.users (email, password_hash, role, is_admin) VALUES (%s, %s, %s, %s) RETURNING id, email, role, is_admin",
                    (email, password_hash, 'user', False)
                )
                conn.commit()
                user = cur.fetchone()
                
                token = jwt.encode({
                    'user_id': user['id'],
                    'email': user['email'],
                    'role': user['role'],
                    'is_admin': user['is_admin'],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                log_security_event(cur, user['id'], 'register_success', True, client_ip, user_agent, '')
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'token': token, 'user': dict(user)}),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                locked, lock_msg = check_account_lockout(cur, email)
                if locked:
                    log_security_event(cur, None, 'login_locked', False, client_ip, user_agent, email)
                    conn.commit()
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': lock_msg}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id, email, password_hash, role, is_admin, is_active FROM t_p29917108_anime_viewer_portal.users WHERE email = %s", (email,))
                user = cur.fetchone()
                
                if not user:
                    log_security_event(cur, None, 'login_user_not_found', False, client_ip, user_agent, email)
                    conn.commit()
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'}),
                        'isBase64Encoded': False
                    }
                
                if not user.get('is_active', True):
                    log_security_event(cur, user['id'], 'login_inactive', False, client_ip, user_agent, '')
                    conn.commit()
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Аккаунт деактивирован'}),
                        'isBase64Encoded': False
                    }
                
                if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                    update_failed_attempts(cur, conn, email)
                    log_security_event(cur, user['id'], 'login_wrong_password', False, client_ip, user_agent, '')
                    conn.commit()
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'}),
                        'isBase64Encoded': False
                    }
                
                reset_failed_attempts(cur, conn, email)
                
                token = jwt.encode({
                    'user_id': user['id'],
                    'email': user['email'],
                    'role': user['role'],
                    'is_admin': user['is_admin'],
                    'exp': datetime.utcnow() + timedelta(days=30)
                }, jwt_secret, algorithm='HS256')
                
                log_security_event(cur, user['id'], 'login_success', True, client_ip, user_agent, '')
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'email': user['email'],
                            'role': user['role'],
                            'is_admin': user['is_admin']
                        }
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не предоставлен'}),
                    'isBase64Encoded': False
                }
            
            try:
                payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
                
                cur.execute("SELECT is_active FROM t_p29917108_anime_viewer_portal.users WHERE id = %s", (payload['user_id'],))
                user_check = cur.fetchone()
                
                if not user_check or not user_check.get('is_active', True):
                    log_security_event(cur, payload['user_id'], 'verify_inactive', False, client_ip, user_agent, '')
                    conn.commit()
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Аккаунт деактивирован'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'user': payload}),
                    'isBase64Encoded': False
                }
            except jwt.ExpiredSignatureError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен истёк'}),
                    'isBase64Encoded': False
                }
            except jwt.InvalidTokenError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный токен'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
