import { NextResponse, type NextRequest } from 'next/server';
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
