import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CustomJwtPayLoad, verifyJWTToken } from '@/lib/auth';
import { hashSecretId } from '@/lib/secret';

type Body = {
  hint: string;
  content: string;
  revealCount: number;
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  const secretId = request.nextUrl.searchParams.get('secretId');
  let userInfo;
  if (token && token?.value !== 'undefined') {
    userInfo = await verifyJWTToken(token.value);
  }

  //secretId가 오지 않았을 때
  if (!secretId) {
    return NextResponse.json(
      { error: '비밀 ID가 제공되지 않았습니다.' },
      { status: 400 }
    );
  }

  //자신의 비밀에 대한 요청일 때
  if (userInfo && (await hashSecretId(userInfo.loginId)) === secretId) {
    try {
      const secretInfo = await prisma.secret.findUnique({
        where: {
          id: secretId,
        },
        select: {
          hint: true,
          content: true,
          revealCount: true,
        },
      });

      if (!secretInfo)
        throw new Error('나의 비밀 정보를 가져오는 중 에러가 발생했습니다.');

      return NextResponse.json({
        hint: secretInfo.hint,
        content: secretInfo.content,
        revealCount: secretInfo.revealCount,
        ownerNickname: userInfo.nickname,
      });
    } catch (error) {
      console.error('나의 비밀 정보를 가져오는 중 에러가 발생했습니다.', error);
      return NextResponse.json(
        { error: '나의 비밀 정보를 가져오는 중 에러가 발생했습니다.' },
        { status: 500 }
      );
    }
  }

  //로그인 하지 않았거나, 타인의 비밀에 대한 요청일 때
  try {
    const secretInfo = await prisma.secret.findUnique({
      where: {
        id: secretId,
      },
      select: {
        hint: true,
        content: true,
        revealCount: true,
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    if (!secretInfo)
      throw new Error('비밀 정보를 가져오는 중 에러가 발생했습니다.');

    return NextResponse.json({
      hint: secretInfo.hint,
      contentLength: secretInfo.content.length,
      revealCount: secretInfo.revealCount,
      ownerNickname: secretInfo.owner.nickname,
    });
  } catch (error) {
    console.error('비밀 정보를 가져오는 중 에러가 발생했습니다.', error);
    return NextResponse.json(
      {
        error: '비밀 정보를 가져오는 중 에러가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  let userInfo: CustomJwtPayLoad | undefined;
  try {
    if (token) {
      userInfo = await verifyJWTToken(token.value);
    }
  } catch {
    //부적절한 토큰일 때
    return NextResponse.redirect(
      `${process.env.PROTOCOL}://${process.env.HOST}/login`
    );
  }

  //로그인 안되어 있을 때
  if (userInfo === undefined) {
    return NextResponse.redirect(
      `${process.env.PROTOCOL}://${process.env.HOST}/login`
    );
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
  try {
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
    if (!newSecret) throw new Error('비밀 생성 중 문제가 발생했습니다.');
  } catch {
    return NextResponse.json(
      {
        error: '비밀 생성 중 문제가 발생했습니다.',
      },
      { status: 500 }
    );
  }
  return NextResponse.json({
    redirectUrl: `/secret/make/${newSecretId}`,
  });
}
