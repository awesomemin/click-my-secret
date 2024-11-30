import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CustomJwtPayLoad, verifyJWTToken } from '@/app/lib/auth';
import { hashSecretId } from '@/app/lib/secret';

type Body = {
  hint: string;
  content: string;
  revealCount: number;
};

export async function POST(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  let userInfo: CustomJwtPayLoad | undefined;
  try {
    if (token) {
      userInfo = await verifyJWTToken(token.value);
    }
  } catch (error: any) {
    //부적절한 토큰일 때
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //로그인 안되어 있을 때
  if (userInfo === undefined) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //body 데이터에 문제가 있을 때
  const body: Body = await request.json();
  if (
    !(body.content && body.hint && body.revealCount) ||
    body.revealCount < 1 ||
    body.revealCount > 10
  ) {
    return NextResponse.json(
      { error: '입력 값이 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  //정상 요청
  const newSecretId = await hashSecretId(userInfo.loginId);
  const newSecret = await prisma.secret.create({
    data: {
      id: newSecretId,
      hint: body.hint,
      content: body.content,
      revealCount: body.revealCount,
      owner: {
        connect: { id: userInfo.userId },
      },
    },
  });
  return NextResponse.json(newSecret);
}
