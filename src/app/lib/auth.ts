import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;

export async function verifyJWTToken(token: string) {
  const secret = new TextEncoder().encode(SECRET_KEY);

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error('부적절한 토큰입니다.');
  }
}

export async function generateJWTToken(loginId: string, nickname: string) {
  const secret = new TextEncoder().encode(SECRET_KEY);

  const token = await new SignJWT({ loginId, nickname })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret);

  return token;
}
