import { NextRequest, NextResponse } from 'next/server';
import { CustomJwtPayLoad, verifyJWTToken } from './app/lib/auth';
import { hashSecretId } from './app/lib/secret';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  let userInfo: CustomJwtPayLoad | undefined;
  if (token) {
    userInfo = await verifyJWTToken(token.value);
  }

  if (request.nextUrl.pathname === '/secret/make') {
    if (userInfo === undefined)
      //로그인 안되어있을 때
      return NextResponse.redirect(new URL('/login', request.url));

    const response = await fetch(
      new URL(`/api/userhassecret?userId=${userInfo.userId}`, request.url)
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const { hasSecret } = await response.json();

    if (hasSecret) {
      // 비밀이 이미 있을 때
      return NextResponse.redirect(
        new URL(`/secret/${await hashSecretId(userInfo.loginId)}`, request.url)
      ); //본인의 비밀 페이지로 이동시켜야 함 (추후 구현)
    }

    // 비밀이 없을 때는 정상 진행
  }
}

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)',
};
