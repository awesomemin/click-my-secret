'use client';

import Image from 'next/image';
import envelope from '@/../public/envelope.png';
import { Gamja_Flower } from 'next/font/google';
import { useState } from 'react';
import { MdArrowBack, MdLightbulb, MdGroups } from 'react-icons/md';
import { prisma } from '@/app/lib/prisma';

const gamja = Gamja_Flower({
  subsets: ['latin'],
  weight: '400',
});

function handleSecretSubmit(
  content: string,
  hint: string,
  revealCount: number
) {
  if (revealCount <= 0 || revealCount > 10) {
    alert('비밀 공개는 1 ~ 10명에게 할 수 있습니다.');
    return;
  }
  if (hint.trim() === '') {
    alert('비밀 힌트를 입력해주세요.');
    return;
  }
  makeSecret(content, hint, revealCount);
}

async function makeSecret(content: string, hint: string, revealCount: number) {
  const response = await fetch('/api/secret', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      hint,
      revealCount,
    }),
  });
  const data = await response.json();
  console.log(data);
}

export default function SecretMake() {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState('');
  const [hint, setHint] = useState('');
  const [revealCount, setRevealCount] = useState(3);
  return (
    <>
      <div className="flex flex-col items-center h-screen">
        <h1 className="font-semibold text-2xl mt-[60px] text-center">
          비밀 만들기
        </h1>
        {step === 1 ? (
          <>
            <Image
              src={envelope}
              alt="image of envelope"
              className="w-20 mt-[60px]"
            />
            <p className="font-semibold text-base mt-4 mb-6">
              친구에게 공유하고 싶은
              <br />
              나의 비밀을 적어주세요
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="사실 나의 비밀은..."
              className={`${gamja.className} bg-inputBg w-full border border-lightGray rounded-2xl flex-grow outline-none p-3 text-xs placeholder:text-gray`}
            ></textarea>
            <button
              onClick={(e) => {
                if (content.trim() === '') {
                  alert('비밀 내용을 입력해주세요.');
                  return;
                }
                if (content.length < 10) {
                  alert('비밀 내용은 앞뒤 공백 제외 10자 이상 입력해주세요.');
                  return;
                }
                setStep(2);
              }}
              className="w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-6 mb-[60px]"
            >
              다음 단계
            </button>
          </>
        ) : (
          <>
            <MdArrowBack
              className="absolute top-3 left-3 w-6 h-6"
              onClick={() => setStep(1)}
            />
            <div className="w-full mt-7">
              <label className="text-sm font-semibold text-gray ml-2">
                비밀 힌트
              </label>
              <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-inputBg mb-6 mt-2">
                <MdLightbulb className="ml-[18px] text-lightGray w-6 h-6" />
                <input
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="무엇에 관한 비밀인지 입력해보세요"
                  name="hint"
                  className={`w-full mx-3 bg-inputBg outline-none placeholder-lightGray text-sm placeholder:font-sans ${gamja.className}`}
                ></input>
              </div>
            </div>
            <div className="w-full">
              <label className="text-sm font-semibold text-gray ml-2">
                비밀을 공개할 인원 수
              </label>
              <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-inputBg mt-2 mb-2">
                <MdGroups className="ml-[18px] text-lightGray w-6 h-6" />
                <input
                  type="number"
                  value={revealCount}
                  onChange={(e) => {
                    if (
                      e.target.value.startsWith('0') &&
                      e.target.value.length > 1
                    ) {
                      e.target.value = e.target.value.replace(/^0+/, '');
                    }
                    if (+e.target.value > 10) {
                      e.target.value = '10';
                    }
                    setRevealCount(+e.target.value);
                  }}
                  name="reveal-count"
                  className="w-full mx-3 bg-inputBg outline-none"
                ></input>
              </div>
              <p className="font-light text-xs text-gray text-right">
                2024. 12. 24. 22:00 기준
                <br />
                클릭 수 상위 N명에게만 비밀이 공유돼요
              </p>
            </div>
            <div className="flex-grow"></div>
            <p className="text-lightGray text-[10px] font-light text-center mb-9">
              비밀은 한 번 만들고 나면
              <br />
              수정, 삭제가 불가능합니다.
              <br />이 점 유의하시기 바랍니다.
            </p>
            <button
              onClick={() => handleSecretSubmit(content, hint, revealCount)}
              className="w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-6 mb-[60px]"
            >
              완료
            </button>
          </>
        )}
      </div>
    </>
  );
}
