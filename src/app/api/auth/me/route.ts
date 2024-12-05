import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  if (token === undefined || token.value === '') {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
  let userInfo;
  try {
    userInfo = await verifyJWTToken(token.value);
  } catch {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  } catch {
    return NextResponse.json({ loggedIn: false }, { status: 404 });
  }

  return NextResponse.json({ loggedIn: true, user: user });
}
