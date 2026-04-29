import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  try {
    // Vercel handles the body stream for us
    const blob = await put(filename as string, req, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
