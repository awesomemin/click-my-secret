import { NextRequest, NextResponse } from 'next/server';
import { CustomJwtPayLoad, verifyJWTToken } from './lib/auth';
import { hashSecretId } from './lib/secret';

let lastRedisSync = new Date();

export async function middleware(request: NextRequest) {
  if (Date.now() - lastRedisSync.getTime() >= 60 * 60 * 1000) {
    fetch(`http://127.0.0.1:${process.env.PORT}/api/redisSync`);
    lastRedisSync = new Date();
  }
  const token = request.cookies.get('jwtToken');
  let userInfo: CustomJwtPayLoad | undefined;
  if (token) {
    userInfo = await verifyJWTToken(token.value);
  }

  if (request.nextUrl.pathname === '/secret/make') {
    if (userInfo === undefined)
      //로그인 안되어있을 때
      return NextResponse.redirect(
        `${process.env.PROTOCOL}://${process.env.HOST}/login`
      );

    const response = await fetch(
      `http://127.0.0.1:${process.env.PORT}/api/userhassecret?userId=${userInfo.userId}`
    );

    if (!response.ok) {
      return NextResponse.redirect(
        `${process.env.PROTOCOL}://${process.env.HOST}/`
      );
    }

    const { hasSecret } = await response.json();

    if (hasSecret) {
      // 비밀이 이미 있을 때
      return NextResponse.redirect(
        `${process.env.PROTOCOL}://${
          process.env.HOST
        }/secret/${await hashSecretId(userInfo.loginId)}`
      ); //본인의 비밀 페이지로 이동시켜야 함 (추후 구현)
    }

    // 비밀이 없을 때는 정상 진행
  }

  if (request.nextUrl.pathname.startsWith('/secret/make/')) {
    const secretId = request.nextUrl.pathname.slice(13);
    if (userInfo === undefined) {
      return NextResponse.redirect(
        `${process.env.PROTOCOL}://${process.env.HOST}/secret/${secretId}`
      );
    }
    if ((await hashSecretId(userInfo.loginId)) !== secretId) {
      return NextResponse.redirect(
        `${process.env.PROTOCOL}://${process.env.HOST}/secret/${secretId}`
      );
    }
  }
}

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)',
};
