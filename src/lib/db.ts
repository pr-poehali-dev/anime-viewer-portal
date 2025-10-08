const API_BASE = 'https://api.poehali.dev';

export async function perform_sql_query(query: string): Promise<any[]> {
  const response = await fetch(`${API_BASE}/db/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Database query failed');
  }

  const data = await response.json();
  return data.rows || [];
}
