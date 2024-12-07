import { verifyJWTToken } from '@/lib/auth';
import { hashSecretId } from '@/lib/secret';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('jwtToken');
  console.log(token);
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
  const secretId = await hashSecretId(userInfo.loginId);
  return NextResponse.json({
    secretId,
  });
}
