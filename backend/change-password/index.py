'''
Business: Secure password change functionality with validation
Args: event with httpMethod POST, body (old_password, new_password), headers (X-Auth-Token)
Returns: HTTP response with success or error message
Security: Validates old password, enforces strong password policy
'''

import json
import os
import jwt
import bcrypt
import re
from datetime import datetime
from typing import Dict, Any, Tuple
import psycopg2
from psycopg2.extras import RealDictCursor

def get_client_ip(event: Dict[str, Any]) -> str:
    return event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')

def get_user_agent(event: Dict[str, Any]) -> str:
    return event.get('headers', {}).get('User-Agent', 'unknown')

def log_security_event(cur, user_id: int, action: str, success: bool, ip: str, user_agent: str, details: str = ''):
    try:
        cur.execute(
            "INSERT INTO t_p29917108_anime_viewer_portal.security_logs (user_id, action, success, ip_address, user_agent, details) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, action, success, ip, user_agent, details)
        )
    except Exception:
        pass

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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    client_ip = get_client_ip(event)
    user_agent = get_user_agent(event)
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET', 'default-secret-change-me')
    
    token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'}),
            'isBase64Encoded': False
        }
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        user_id = payload.get('user_id')
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
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        body = json.loads(event.get('body', '{}'))
        old_password = body.get('old_password', '')
        new_password = body.get('new_password', '')
        
        if not old_password or not new_password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Необходимо указать старый и новый пароль'}),
                'isBase64Encoded': False
            }
        
        valid, error_msg = validate_password(new_password)
        if not valid:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': error_msg}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "SELECT id, email, password_hash, is_active FROM t_p29917108_anime_viewer_portal.users WHERE id = %s",
            (user_id,)
        )
        user = cur.fetchone()
        
        if not user:
            log_security_event(cur, user_id, 'password_change_user_not_found', False, client_ip, user_agent, '')
            conn.commit()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь не найден'}),
                'isBase64Encoded': False
            }
        
        if not user.get('is_active', True):
            log_security_event(cur, user_id, 'password_change_inactive', False, client_ip, user_agent, '')
            conn.commit()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Аккаунт деактивирован'}),
                'isBase64Encoded': False
            }
        
        if not bcrypt.checkpw(old_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            log_security_event(cur, user_id, 'password_change_wrong_old_password', False, client_ip, user_agent, '')
            conn.commit()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный старый пароль'}),
                'isBase64Encoded': False
            }
        
        if old_password == new_password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Новый пароль должен отличаться от старого'}),
                'isBase64Encoded': False
            }
        
        new_password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cur.execute(
            "UPDATE t_p29917108_anime_viewer_portal.users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
            (new_password_hash, user_id)
        )
        conn.commit()
        
        log_security_event(cur, user_id, 'password_change_success', True, client_ip, user_agent, '')
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Пароль успешно изменён'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
