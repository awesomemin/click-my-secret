import bcrypt from 'bcryptjs';

export async function hashSecretId(loginId: string): Promise<string> {
  const saltRounds = 10;
  try {
    const secretId = await bcrypt.hash(loginId, saltRounds);
    return secretId;
  } catch (error: any) {
    console.error('비밀 ID 생성 중 에러가 발생했습니다.', error);
    throw new Error(error.message);
  }
}
