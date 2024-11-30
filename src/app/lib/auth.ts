import { JWTPayload, jwtVerify, SignJWT } from 'jose';

export interface CustomJwtPayLoad extends JWTPayload {
  userId: number;
  loginId: string;
  nickname: string;
}

const SECRET_KEY = process.env.JWT_SECRET;

export async function verifyJWTToken(token: string): Promise<CustomJwtPayLoad> {
  const secret = new TextEncoder().encode(SECRET_KEY);

  try {
    const { payload } = await jwtVerify(token, secret);
    const customPayload = payload as CustomJwtPayLoad;
    return customPayload;
  } catch (error) {
    console.error(error);
    throw new Error('부적절한 토큰입니다.');
  }
}

export async function generateJWTToken(
  userId: number,
  loginId: string,
  nickname: string
) {
  const secret = new TextEncoder().encode(SECRET_KEY);

  const token = await new SignJWT({ userId, loginId, nickname })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret);

  return token;
}
