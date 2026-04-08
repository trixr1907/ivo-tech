import { handleCspReportRequest } from '@/server/security/cspReport';

export async function POST(request: Request) {
  return handleCspReportRequest(request);
}

export async function GET(request: Request) {
  return handleCspReportRequest(request);
}

export async function PUT(request: Request) {
  return handleCspReportRequest(request);
}

export async function PATCH(request: Request) {
  return handleCspReportRequest(request);
}

export async function DELETE(request: Request) {
  return handleCspReportRequest(request);
}
