import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx prisma db push --skip-generate --accept-data-loss', {
      env: { ...process.env },
      cwd: process.cwd(),
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: 30000,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Database tables created!',
      logs: result.substring(0, 1000),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { status: 'error', message: msg },
      { status: 500 }
    );
  }
}
