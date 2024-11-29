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
  let [state, formAction, isPending] = useActionState(signUp, null);

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
              state?.isIdInvalid ? 'text-red-500' : 'text-gray'
            }`}
          >
            ID
          </label>
          <div
            className={`flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-6 mt-2 ${
              state?.isIdInvalid ? 'border-red-500' : ''
            }`}
          >
            <MdPerson
              className={`ml-[18px] text-lightGray w-6 h-6 ${
                state?.isIdInvalid ? 'text-red-500' : ''
              }`}
            />
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full mx-3 bg-background outline-none"
              name="id"
            ></input>
          </div>
          <label
            className={`text-sm font-semibold text-gray ml-2 ${
              state?.isPwInvalid ? 'text-red-500' : ''
            }`}
          >
            비밀번호
          </label>
          <div
            className={`flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-6 mt-2 ${
              state?.isPwInvalid ? 'border-red-500' : ''
            }`}
          >
            <MdLock
              className={`ml-[18px] text-lightGray w-6 h-6 ${
                state?.isPwInvalid ? 'text-red-500' : ''
              }`}
            />
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type="password"
              className="w-full mx-3 bg-background outline-none"
              name="pw"
            ></input>
          </div>
          <label
            className={`text-sm font-semibold text-gray ml-2 ${
              state?.isNicknameInvalid ? 'text-red-500' : ''
            }`}
          >
            닉네임
          </label>
          <div
            className={`flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mt-2 ${
              state?.isNicknameInvalid ? 'border-red-500' : ''
            }`}
          >
            <MdTagFaces
              className={`ml-[18px] text-lightGray w-6 h-6 ${
                state?.isNicknameInvalid ? 'text-red-500' : ''
              }`}
            />
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mx-3 bg-background outline-none"
              name="nickname"
            ></input>
          </div>
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
        <div
          className={`fixed bottom-0 p-2 -mx-10 bg-white w-screen text-center text-black transition-transform delay-300 ${
            state ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {state?.message &&
            state.message
              .split('.')
              .filter((sentence) => sentence.trim() !== '')
              .map((sentence, index) => <p key={index}>{sentence}.</p>)}
        </div>
      </div>
    </>
  );
}
