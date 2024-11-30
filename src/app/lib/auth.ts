import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyJWTToken(token: string) {
  if (SECRET_KEY === undefined) {
    throw new Error('서버 환경 변수에 SECRET KEY가 설정되지 않았습니다.');
  }
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('부적절한 토큰입니다.');
  }
}

export function generateJWTToken(userId: string) {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30d' });
}
