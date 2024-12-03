import { NextRequest, NextResponse } from 'next/server';
import redis, { loadDataToRedis } from '@/app/lib/redis';
import { verifyJWTToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('jwtToken');

  let userInfo;
  if (token && token!.value !== 'undefined') {
    try {
      userInfo = await verifyJWTToken(token.value);
    } catch {
      return NextResponse.json({
        redirectUrl: '/login',
      });
    }
  } else {
    return NextResponse.json({
      redirectUrl: '/login',
    });
  }

  const secretId = request.nextUrl.searchParams.get('secretId');
  const key = `user:${userInfo.userId}:${secretId}:clicks`;
  await redis.incr(key);
  return NextResponse.json({ message: '클 릭' });
}

export async function GET(request: NextRequest) {
  loadDataToRedis();
  return NextResponse.json({ clicks: 0 });
}
