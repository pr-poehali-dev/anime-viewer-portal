'''
Business: Comments management for anime - add and view comments
Args: event with httpMethod (GET/POST), body (anime_id, comment_text), headers (X-Auth-Token)
Returns: HTTP response with comments or operation result
'''

import json
import os
import jwt
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_from_token(token: str, jwt_secret: str) -> Dict[str, Any]:
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        anime_id = query_params.get('anime_id')
        
        if not anime_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'anime_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            """SELECT c.id, c.comment_text, c.created_at, u.email 
               FROM comments c 
               JOIN users u ON c.user_id = u.id 
               WHERE c.anime_id = %s 
               ORDER BY c.created_at DESC""",
            (anime_id,)
        )
        comments = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps([dict(c) for c in comments], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        user = get_user_from_token(token, jwt_secret)
        
        if not user:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Authentication required'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        anime_id = body.get('anime_id')
        comment_text = body.get('comment_text', '')
        
        if not anime_id or not comment_text:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'anime_id and comment_text required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            """INSERT INTO comments (anime_id, user_id, comment_text) 
               VALUES (%s, %s, %s) RETURNING id, comment_text, created_at""",
            (anime_id, user['user_id'], comment_text)
        )
        conn.commit()
        new_comment = cur.fetchone()
        
        result = dict(new_comment)
        result['email'] = user['email']
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
