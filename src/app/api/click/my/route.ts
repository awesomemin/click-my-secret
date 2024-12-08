import { verifyJWTToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  if (!token) {
    return NextResponse.json(
      { error: '로그인 되지 않은 상태입니다.' },
      { status: 401 }
    );
  }
  let userInfo;
  try {
    userInfo = await verifyJWTToken(token.value);
  } catch {
    return NextResponse.json(
      { error: '유효하지 않은 토큰입니다.' },
      { status: 401 }
    );
  }
  const results = [];
  let cursor = 0;
  do {
    const result = await redis.scan(cursor, {
      MATCH: `user:${userInfo.userId}:*:clicks`,
      COUNT: 100,
    });

    cursor = +result.cursor;

    for (const key of result.keys) {
      const secretId = key.split(':')[2];
      const clickCount = await redis.get(key);
      const secretInfo = await prisma.secret.findUnique({
        where: {
          id: secretId,
        },
        include: {
          owner: {
            select: {
              nickname: true,
            },
          },
        },
      });
      results.push({
        ownerNickname: secretInfo?.owner.nickname,
        hint: secretInfo?.hint,
        clickCount: clickCount,
        secretId: secretInfo?.id,
        revealCount: secretInfo?.revealCount,
      });
    }
  } while (cursor !== 0);
  return NextResponse.json({
    results,
  });
}
