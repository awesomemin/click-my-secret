'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { loginResult, signUpResult } from './types';
import { redirect } from 'next/navigation';
import { generateJWTToken } from '../lib/auth';

class SignUpError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function signUp(
  currentState: Record<string, any>,
  formData: FormData
): Promise<signUpResult | loginResult> {
  const id = formData.get('id')?.toString().trim();
  const pw = formData.get('pw')?.toString().trim();
  const nickname = formData.get('nickname')?.toString().trim();
  const actionResult: signUpResult = {};
  if (!id) {
    actionResult.idErrMsg = 'ID를 입력해주세요.';
  } else if (!isValidId(id)) {
    actionResult.idErrMsg =
      'ID는 3~20자 사이의\n영문 대소문자 및 숫자로 입력해주세요.';
  }
  if (!pw) {
    actionResult.pwErrMsg = '비밀번호를 입력해주세요.';
  } else if (!isValidPw(pw)) {
    actionResult.pwErrMsg =
      '비밀번호는 3~20자 사이의 영문 대소문자 및 숫자, 특수문자(~,!,@,#,$,%,^,&,*,?)로 입력해주세요.';
  }
  if (!nickname) {
    actionResult.nicknameErrMsg = '닉네임을 입력해주세요.';
  } else if (!isValidNickname(nickname)) {
    actionResult.nicknameErrMsg =
      '닉네임은 2~10자 사이의 영문, 한글, 및 특수문자(~,!,@,#,$,%,^,&,*,?)로 입력해주세요.';
  }
  if (Object.keys(actionResult).length !== 0) return actionResult;

  const hashedPw = await hashPassword(pw!);
  try {
    const newUser = await prisma.user.create({
      data: {
        loginId: id!,
        password: hashedPw,
        nickname: nickname!,
      },
    });
    if (!newUser) {
      throw new Error('회원가입 중 문제가 발생했습니다.');
    }
  } catch (error: unknown) {
    if (error instanceof SignUpError) {
      if (error.code === 'P2002' && error.message.includes('nickname')) {
        actionResult.nicknameErrMsg = '이미 존재하는 닉네임입니다.';
      } else if (error.code === 'P2002' && error.message.includes('loginId')) {
        actionResult.idErrMsg = '중복된 ID입니다.';
      } else {
        throw new Error(error.message);
      }
    }
  }
  if (Object.keys(actionResult).length !== 0) return actionResult;

  const loginResult = await login(currentState, formData);
  return loginResult;
}

export async function login(
  currentState: Record<string, any>,
  formData: FormData
): Promise<loginResult> {
  const id = formData.get('id')?.toString().trim();
  const pw = formData.get('pw')?.toString().trim();
  const actionResult: loginResult = {
    success: true,
  };
  if (!id || !pw) {
    actionResult.success = false;
    actionResult.message = 'ID와 비밀번호를 입력해주세요.';
    return actionResult;
  }
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        loginId: id,
      },
    });
    if (!user) {
      throw new Error('ID 또는 비밀번호가 잘못되었습니다.');
    }
    if (!(await isPasswordValid(pw, user.password))) {
      throw new Error('ID 또는 비밀번호가 잘못되었습니다.');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      actionResult.success = false;
      actionResult.message = error.message;
    } else {
      actionResult.success = false;
      actionResult.message = '알 수 없는 오류가 발생했습니다.';
    }
    return actionResult;
  }

  const jwtToken = await generateJWTToken(user.id, user.loginId, user.nickname);
  const cookieStore = await cookies();
  cookieStore.set('jwtToken', jwtToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
    sameSite: true,
  });
  actionResult.message = '성공적으로 로그인하였습니다.';
  redirect('/');
  return actionResult;
}

function isValidId(id: string): boolean {
  const regex = /^[a-zA-Z0-9]{3,20}$/;
  return regex.test(id);
}

function isValidPw(pw: string): boolean {
  const regex = /^[a-zA-Z0-9~!@#$%^&*?]{3,20}$/;
  return regex.test(pw);
}

function isValidNickname(nickname: string): boolean {
  const regex = /^[가-힣a-zA-Z~!@#$%^&*?]{2,10}$/;
  return regex.test(nickname);
}

async function hashPassword(plainPw: string): Promise<string> {
  const saltRounds = 10;
  try {
    const hashedPw = await bcrypt.hash(plainPw, saltRounds);
    return hashedPw;
  } catch (error: unknown) {
    console.error('비밀번호 해싱 도중 에러가 발생했습니다.', error);
    throw new Error('비밀번호 해싱 도중 에러가 발생했습니다.');
  }
}

async function isPasswordValid(
  plainPw: string,
  hashedPw: string
): Promise<boolean> {
  return await bcrypt.compare(plainPw, hashedPw);
}
