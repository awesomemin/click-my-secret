import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyJWTToken } from '@/lib/auth';
import { hashSecretId } from '@/lib/secret';

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
  if ((await hashSecretId(userInfo.loginId)) === secretId) {
    return NextResponse.json(
      { error: '자신의 비밀은 클릭할 수 없습니다.' },
      { status: 400 }
    );
  }
  const key = `user:${userInfo.userId}:${secretId}:clicks`;
  await redis.incr(key);
  return NextResponse.json({ message: '클 릭' });
}
