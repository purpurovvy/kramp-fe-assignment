import type { NextApiRequest, NextApiResponse } from 'next';

const GRAPHQL_URL = process.env.GRAPHQL_URL ?? 'http://localhost:4000/graphql';

const ALLOWED_OPERATIONS = new Set([
  'GetProduct',
  'GetProducts',
  'SearchProducts',
  'Search',
]);

function isAllowedOperation(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const { query } = body as Record<string, unknown>;
  if (typeof query !== 'string') {
    return false;
  }
  return (
    ALLOWED_OPERATIONS.size > 0 &&
    Array.from(ALLOWED_OPERATIONS).some(op => query.includes(op))
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOperation(req.body)) {
    return res.status(400).json({ error: 'Operation not permitted' });
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = (await response.json()) as unknown;
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Upstream service unavailable' });
  }
}
