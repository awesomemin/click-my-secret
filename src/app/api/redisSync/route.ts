import { NextRequest, NextResponse } from 'next/server';
import { syncRedis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    await syncRedis();
  } catch (error) {
    return NextResponse.json(
      { error: '레디스 동기화 중 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
  return NextResponse.json({
    error: '레디스 동기화가 성공적으로 완료되었습니다.',
  });
}
