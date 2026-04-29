import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return new Response('Filename and body are required', { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
