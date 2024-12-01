'use client';

import { Gamja_Flower } from 'next/font/google';
import Countdown from '@/components/countdown';
import { useEffect, useState } from 'react';
import Key from '@/../public/key.png';
import Image from 'next/image';

const gamja = Gamja_Flower({
  subsets: ['latin'],
  weight: '400',
});

export default function SecretPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-center mt-[60px] mb-8">
          <span className="text-primary">{'어썸민'}</span>님의 비밀
        </h1>
        {isClient ? <Countdown /> : <div className="h-[83px]"></div>}
        <div className="w-full mt-7">
          <label className="text-sm font-semibold text-gray ml-2">
            비밀 힌트
          </label>
          <div
            className={`flex items-center justify-center w-full h-[60px] border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm ${gamja.className}`}
          >
            {'hint'}
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="text-sm font-semibold text-gray ml-2">
            비밀 내용
          </label>
          <div
            className={`w-full break-words p-3 overflow-y-scroll border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm ${gamja.className}`}
          >
            <div className="blur-sm">비밀은 정당한 방법으로 확인하세요 ^^</div>
          </div>
        </div>
        <p className="text-gray text-sm text-center mt-4">
          2024. 12. 24. 22:00 기준
          <br />
          클릭 수 상위 {2}명에게만
          <br />
          비밀이 공유돼요.
        </p>
        <Image
          src={Key}
          alt="image of a key"
          className="w-24 h-24 mx-auto my-5"
        />
      </div>
    </>
  );
}
