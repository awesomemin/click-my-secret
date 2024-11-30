import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { error: '유저 ID가 전달되지 않았습니다.' },
      { status: 400 }
    );
  }
  try {
    const userWithSecret = await prisma.user.findUnique({
      where: { id: +userId },
      include: { secret: true },
    });
    if (!userWithSecret) throw new Error('존재하지 않는 유저입니다.');
    return NextResponse.json({ hasSecret: !!userWithSecret?.secret });
  } catch (error: any) {
    if (error.message === '존재하지 않는 유저입니다.') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    throw new Error(error.message);
  }
}
