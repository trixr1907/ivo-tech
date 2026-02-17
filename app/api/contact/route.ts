import { handleContactRequest } from '@/server/contact/handler';

export async function POST(request: Request) {
  return handleContactRequest(request);
}

export async function GET(request: Request) {
  return handleContactRequest(request);
}

export async function PUT(request: Request) {
  return handleContactRequest(request);
}

export async function PATCH(request: Request) {
  return handleContactRequest(request);
}

export async function DELETE(request: Request) {
  return handleContactRequest(request);
}
