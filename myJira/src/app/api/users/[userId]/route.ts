import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = await params; // Resolving the promise
  const { userId } = resolvedParams;

  // Your logic here
  return NextResponse.json({ userId });
}
