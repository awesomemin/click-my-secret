'use server';

//import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

// const SECRET_KEY = process.env.JWT_SECRET;

export async function signUp(currentState: any, formData: FormData) {
  const id = formData.get('id')?.toString().trim();
  const pw = formData.get('pw')?.toString().trim();
  const nickname = formData.get('nickname')?.toString().trim();
  const actionResult = {
    message: '',
    isIdInvalid: false,
    isPwInvalid: false,
    isNicknameInvalid: false,
  };
  if (!id) {
    actionResult.message += 'ID를 입력해주세요.';
    actionResult.isIdInvalid = true;
  } else if (!isValidId(id)) {
    actionResult.message +=
      'ID는 3~20자 사이의 영문 대소문자 및 숫자로 입력해주세요.';
    actionResult.isIdInvalid = true;
  }

  if (!pw) {
    actionResult.message += '비밀번호를 입력해주세요.';
    actionResult.isPwInvalid = true;
  } else if (!isValidPw(pw)) {
    actionResult.message +=
      '비밀번호는 3~20자 사이의 영문 대소문자 및 숫자, 특수문자(~,!,@,#,$,%,^,&,*,?)로 입력해주세요.';
    actionResult.isPwInvalid = true;
  }

  if (!nickname) {
    actionResult.message += '닉네임을 입력해주세요.';
    actionResult.isNicknameInvalid = true;
  } else if (!isValidNickname(nickname)) {
    actionResult.message +=
      '닉네임은 2~10자 사이의 영문, 한글, 및 특수문자(~,!,@,#,$,%,^,&,*,?)로 입력해주세요.';
    actionResult.isNicknameInvalid = true;
  }

  if (
    actionResult.isIdInvalid ||
    actionResult.isNicknameInvalid ||
    actionResult.isPwInvalid ||
    id === undefined ||
    pw === undefined ||
    nickname === undefined
  )
    return actionResult;

  const hashedPw = await hashPassword(pw);

  try {
    const newUser = await prisma.user.create({
      data: {
        loginId: id,
        password: hashedPw,
        nickname: nickname,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002' && error.message.includes('nickname')) {
      actionResult.isNicknameInvalid = true;
      actionResult.message += '이미 존재하는 닉네임입니다.';
    } else if (error.code === 'P2002' && error.message.includes('loginId')) {
      actionResult.isIdInvalid = true;
      actionResult.message += '중복된 ID입니다.';
    } else {
      throw new Error(error.message);
    }
  }

  return actionResult;
}

export async function login(currentState: any, formData: FormData) {
  const id = formData.get('id')?.toString().trim();
  const pw = formData.get('pw')?.toString().trim();
  if (!id || !pw) {
    return { message: 'ID와 비밀번호를 입력해주세요.' };
  }
  try {
    const user = await prisma.user.findUnique({
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
    console.log(user);
  } catch (error) {
    console.error('그런 유저 없어요.', error);
  }
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
  } catch (error: any) {
    console.error('비밀번호 해싱 도중 에러가 발생했습니다.', error);
    throw new Error(error.message);
  }
}

async function isPasswordValid(
  plainPw: string,
  hashedPw: string
): Promise<boolean> {
  return await bcrypt.compare(plainPw, hashedPw);
}
