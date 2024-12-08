import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyJWTToken } from '@/lib/auth';
import { hashSecretId } from '@/lib/secret';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  if (1735045200000 < new Date().getTime()) {
    return NextResponse.json(
      {
        error: '클릭 가능 시간이 아닙니다. 곧 비밀이 공개됩니다.',
      },
      { status: 400 }
    );
  }
  const token = request.cookies.get('jwtToken');
  const secretId = request.nextUrl.searchParams.get('secretId');
  if (!secretId) {
    return NextResponse.json(
      { error: 'secret Id를 전달받지 못했습니다.' },
      { status: 400 }
    );
  }

  let userInfo;
  if (token && token!.value !== 'undefined') {
    try {
      userInfo = await verifyJWTToken(token.value);
    } catch {
      return NextResponse.json({
        redirectUrl: '/signup',
      });
    }
  } else {
    return NextResponse.json({
      redirectUrl: '/signup',
    });
  }

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

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  let userInfo;
  if (token && token!.value !== 'undefined') {
    try {
      userInfo = await verifyJWTToken(token.value);
    } catch {
      return NextResponse.json({
        redirectUrl: '/signup',
      });
    }
  }
  const secretId = request.nextUrl.searchParams.get('secretId');
  if (!secretId) {
    return NextResponse.json(
      { error: 'secret Id를 전달받지 못했습니다.' },
      { status: 400 }
    );
  }
  const results = [];
  let cursor = 0;
  do {
    const result = await redis.scan(cursor, {
      MATCH: `user:*:${secretId}:clicks`,
      COUNT: 100,
    });

    cursor = +result.cursor;

    for (const key of result.keys) {
      const clickCount = await redis.get(key);
      const [, userId] = key.split(':');
      const user = await prisma.user.findUnique({
        where: {
          id: +userId,
        },
        select: {
          nickname: true,
        },
      });
      results.push({
        nickname: user?.nickname || null,
        clickCount: clickCount && +clickCount,
        isMe: userInfo ? userInfo.nickname === user?.nickname : false,
      });
    }
  } while (cursor !== 0);

  return NextResponse.json({ leaderboard: results });
}
