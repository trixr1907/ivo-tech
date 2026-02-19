import { ingestAbEvent } from '@/server/ab-report/store';

export async function POST(request: Request) {
  return ingestAbEvent(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS'
    }
  });
}
