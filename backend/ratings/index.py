'''
Business: Rating system for anime - users can rate anime from 1 to 10
Args: event with httpMethod (POST), body (anime_id, rating), headers (X-Auth-Token)
Returns: HTTP response with updated anime rating
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    
    if method == 'POST':
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
        rating = body.get('rating')
        
        if not anime_id or rating is None or rating < 1 or rating > 10:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'anime_id and rating (1-10) required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            """INSERT INTO ratings (anime_id, user_id, rating) 
               VALUES (%s, %s, %s) 
               ON CONFLICT (anime_id, user_id) 
               DO UPDATE SET rating = EXCLUDED.rating, created_at = CURRENT_TIMESTAMP""",
            (anime_id, user['user_id'], rating)
        )
        conn.commit()
        
        cur.execute(
            "SELECT AVG(rating)::DECIMAL(3,1) as avg_rating, COUNT(*) as count FROM ratings WHERE anime_id = %s",
            (anime_id,)
        )
        stats = cur.fetchone()
        
        cur.execute(
            "UPDATE anime SET rating = %s, rating_count = %s WHERE id = %s RETURNING rating, rating_count",
            (float(stats['avg_rating']), stats['count'], anime_id)
        )
        conn.commit()
        updated = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(dict(updated), default=str),
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
