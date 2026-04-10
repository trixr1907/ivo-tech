import { handleAnalyticsRequest } from '@/server/analytics/handler';

export async function POST(request: Request) {
  return handleAnalyticsRequest(request);
}

export async function GET(request: Request) {
  return handleAnalyticsRequest(request);
}

export async function PUT(request: Request) {
  return handleAnalyticsRequest(request);
}

export async function PATCH(request: Request) {
  return handleAnalyticsRequest(request);
}

export async function DELETE(request: Request) {
  return handleAnalyticsRequest(request);
}
