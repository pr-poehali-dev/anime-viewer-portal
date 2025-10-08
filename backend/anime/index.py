'''
Business: Anime CRUD operations - get, create, update, delete anime
Args: event with httpMethod (GET/POST/PUT/DELETE), body, headers (X-Auth-Token for admin)
Returns: HTTP response with anime data or operation result
'''

import json
import os
import jwt
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def verify_admin(token: str, jwt_secret: str) -> Dict[str, Any]:
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        if not payload.get('is_admin') and payload.get('role') != 'admin':
            return None
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
        anime_type = query_params.get('type')
        genre = query_params.get('genre')
        year = query_params.get('year')
        search = query_params.get('search')
        anime_id = query_params.get('id')
        
        if anime_id:
            cur.execute("SELECT * FROM t_p29917108_anime_viewer_portal.anime WHERE id = %s", (anime_id,))
            anime = cur.fetchone()
            
            if anime:
                cur.execute(
                    "SELECT c.id, c.comment_text, c.created_at, u.email FROM t_p29917108_anime_viewer_portal.comments c JOIN t_p29917108_anime_viewer_portal.users u ON c.user_id = u.id WHERE c.anime_id = %s ORDER BY c.created_at DESC",
                    (anime_id,)
                )
                comments = cur.fetchall()
                
                result = dict(anime)
                result['comments'] = [dict(c) for c in comments]
                
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
        
        query = "SELECT * FROM t_p29917108_anime_viewer_portal.anime WHERE 1=1"
        params = []
        
        if anime_type and anime_type != 'all':
            query += " AND type = %s"
            params.append(anime_type)
        
        if genre and genre != 'Все':
            query += " AND genre = %s"
            params.append(genre)
        
        if year and year != 'Все':
            query += " AND year = %s"
            params.append(int(year))
        
        if search:
            query += " AND title ILIKE %s"
            params.append(f'%{search}%')
        
        query += " ORDER BY created_at DESC"
        
        cur.execute(query, params)
        anime_list = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps([dict(a) for a in anime_list], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        admin = verify_admin(token, jwt_secret)
        
        if not admin:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        
        cur.execute(
            """INSERT INTO t_p29917108_anime_viewer_portal.anime (title, description, type, genre, year, episodes, thumbnail_url, created_by) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (
                body.get('title'),
                body.get('description', ''),
                body.get('type'),
                body.get('genre'),
                body.get('year'),
                body.get('episodes', 1),
                body.get('thumbnail_url', ''),
                admin['user_id']
            )
        )
        conn.commit()
        new_anime = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(dict(new_anime), default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        admin = verify_admin(token, jwt_secret)
        
        if not admin:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        body = json.loads(event.get('body', '{}'))
        anime_id = body.get('id')
        
        cur.execute(
            """UPDATE t_p29917108_anime_viewer_portal.anime SET title = %s, description = %s, type = %s, genre = %s, 
               year = %s, episodes = %s, thumbnail_url = %s, updated_at = CURRENT_TIMESTAMP 
               WHERE id = %s RETURNING *""",
            (
                body.get('title'),
                body.get('description'),
                body.get('type'),
                body.get('genre'),
                body.get('year'),
                body.get('episodes'),
                body.get('thumbnail_url'),
                anime_id
            )
        )
        conn.commit()
        updated_anime = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(dict(updated_anime) if updated_anime else {}, default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        admin = verify_admin(token, jwt_secret)
        
        if not admin:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Admin access required'}),
                'isBase64Encoded': False
            }
        
        query_params = event.get('queryStringParameters') or {}
        anime_id = query_params.get('id')
        
        if not anime_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Anime ID required'}),
                'isBase64Encoded': False
            }
        
        cur.execute("DELETE FROM t_p29917108_anime_viewer_portal.anime WHERE id = %s", (anime_id,))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
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