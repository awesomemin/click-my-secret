import { verifyJWTToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
  let userWithSecret;
  try {
    userWithSecret = await prisma.user.findUnique({
      where: { id: userInfo.userId },
      include: { secret: true },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'DB에서 정보를 가져오는 중 문제가 발생했습니다.',
      },
      { status: 500 }
    );
  }
  const secretId = userWithSecret?.secret?.id;
  if (!secretId) {
    return NextResponse.json(
      {
        error: '비밀을 가지고 있지 않은 유저입니다.',
      },
      { status: 404 }
    );
  }
  return NextResponse.json({
    secretId,
  });
}
