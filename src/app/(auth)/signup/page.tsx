'use client';

import { MdPerson, MdLock, MdTagFaces } from 'react-icons/md';
import Link from 'next/link';
import Form from 'next/form';
import { signUp } from '../actions';
import { useActionState, useState } from 'react';
import Spinner from '@/components/spinner';

export default function SignUp() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [nickname, setNickname] = useState('');
  let [actionResult, formAction, isPending] = useActionState(signUp, {});

  return (
    <>
      <div className="flex flex-col h-screen">
        <h1 className="mt-[60px] text-2xl font-semibold">
          ID와 비밀번호 입력만으로
          <br />
          10초만에 시작해요
        </h1>
        <Form action={formAction} className="mt-[55px]">
          <label
            className={`text-sm font-semibold  ml-2 ${
              actionResult &&
              'idErrMsg' in actionResult &&
              actionResult?.idErrMsg
                ? 'text-red-500'
                : 'text-gray'
            }`}
          >
            ID
          </label>
          <div
            className={`flex items-center w-full h-[60px] border  rounded-2xl bg-inputBg mt-2 ${
              actionResult &&
              'idErrMsg' in actionResult &&
              actionResult?.idErrMsg
                ? 'border-red-500'
                : 'border-lightGray'
            }`}
          >
            <MdPerson
              className={`ml-[18px]  w-6 h-6 ${
                actionResult &&
                'idErrMsg' in actionResult &&
                actionResult?.idErrMsg
                  ? 'text-red-500'
                  : 'text-lightGray'
              }`}
            />
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full mx-3 bg-inputBg outline-none"
              name="id"
            ></input>
          </div>
          <p className="text-xs  mb-6 text-red-500 text-right">
            {'idErrMsg' in actionResult && actionResult?.idErrMsg}
          </p>
          <label
            className={`text-sm font-semibold ml-2 ${
              actionResult &&
              'pwErrMsg' in actionResult &&
              actionResult?.pwErrMsg
                ? 'text-red-500'
                : 'text-gray'
            }`}
          >
            비밀번호
          </label>
          <div
            className={`flex items-center w-full h-[60px] border rounded-2xl bg-inputBg mt-2 ${
              actionResult &&
              'pwErrMsg' in actionResult &&
              actionResult?.pwErrMsg
                ? 'border-red-500'
                : 'border-lightGray'
            }`}
          >
            <MdLock
              className={`ml-[18px] w-6 h-6 ${
                actionResult &&
                'pwErrMsg' in actionResult &&
                actionResult?.pwErrMsg
                  ? 'text-red-500'
                  : 'text-lightGray'
              }`}
            />
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type="password"
              className="w-full mx-3 bg-inputBg outline-none"
              name="pw"
            ></input>
          </div>
          <p className="text-xs  mb-6 text-red-500 text-right">
            {'pwErrMsg' in actionResult && actionResult?.pwErrMsg}
          </p>
          <label
            className={`text-sm font-semibold ml-2 ${
              actionResult &&
              'nicknameErrMsg' in actionResult &&
              actionResult?.nicknameErrMsg
                ? 'text-red-500'
                : 'text-gray'
            }`}
          >
            닉네임
          </label>
          <div
            className={`flex items-center w-full h-[60px] border rounded-2xl bg-inputBg mt-2 ${
              actionResult &&
              'nicknameErrMsg' in actionResult &&
              actionResult?.nicknameErrMsg
                ? 'border-red-500'
                : 'border-lightGray'
            }`}
          >
            <MdTagFaces
              className={`ml-[18px] w-6 h-6 ${
                actionResult &&
                'nicknameErrMsg' in actionResult &&
                actionResult?.nicknameErrMsg
                  ? 'text-red-500'
                  : 'text-lightGray'
              }`}
            />
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mx-3 bg-inputBg outline-none"
              name="nickname"
            ></input>
          </div>
          <p className="text-xs text-red-500 text-right">
            {'nicknameErrMsg' in actionResult && actionResult?.nicknameErrMsg}
          </p>
          <button
            type="submit"
            className=" w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-10"
          >
            {isPending ? <Spinner /> : '회원가입'}
          </button>
        </Form>
        <div className="flex-grow"></div>
        <Link href="/login" className="text-center text-gray text-sm mb-20">
          이미 회원인가요?
        </Link>
      </div>
    </>
  );
}
