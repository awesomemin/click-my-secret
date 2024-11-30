import { NextResponse, type NextRequest } from 'next/server';
import { CustomJwtPayLoad, verifyJWTToken } from './app/lib/auth';
import { hashSecretId } from './app/lib/secret';
import { prisma } from './app/lib/prisma';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  let userInfo: CustomJwtPayLoad | undefined;
  if (token) {
    userInfo = await verifyJWTToken(token.value);
  }

  if (request.nextUrl.pathname === '/secret/make') {
    if (userInfo === undefined)
      return NextResponse.redirect(new URL('/login', request.url));

    const secretId = await hashSecretId(userInfo.loginId);
    return NextResponse.redirect(
      new URL(`/secret/make/${secretId}`, request.url)
    );
  }

  if (request.nextUrl.pathname.startsWith('/secret/make/')) {
    if (userInfo === undefined)
      return NextResponse.redirect(new URL('/login', request.url));
    const secretId = await hashSecretId(userInfo.loginId);
    if (request.nextUrl.pathname.slice(13) === secretId) {
      // 제대로 된 곳으로 들어왔어요
      const response = await fetch(
        new URL(`/api/userhassecret?userId=${userInfo.userId}`, request.url)
      );
      if (!response.ok) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      const data = await response.json();
      if (data.hasSecret) {
        //이미 비밀을 가지고 있는 경우에, 본인의 비밀 페이지로 리다이렉트 시킴
        //return NextResponse.redirect(new URL('/secret'))
      }
    } else {
      // 이상한 곳으로 들어왔어요
      return NextResponse.redirect(
        new URL(`/secret/make/${secretId}`, request.url)
      );
    }
  }
}

export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
