'use client';

import Key from '@/../public/key.png';
import Image from 'next/image';
import { useState } from 'react';

export default function Leaderboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  function LeaderboardHeader() {
    return (
      <div
        className="w-screen h-12 rounded-t-xl relative pt-[6px] bg-primary"
        onClick={() => {
          setIsExpanded((p) => !p);
        }}
      >
        <div className="h-[6px] w-16 bg-black opacity-50 mx-auto rounded-full" />
        <p className="text-center font-semibold text-sm mt-[6px]">순위표</p>
      </div>
    );
  }

  function LeaderboardContent() {
    return (
      <div className="flex flex-col gap-2 mx-4 mt-3 pb-3 overflow-scroll">
        <LeaderboardItem nickname="닉네임1" rank={1} point={2215} />
        <LeaderboardItem nickname="닉네임2" rank={2} point={1251} />
        <LeaderboardItem nickname="닉네임3" rank={3} point={795} />
        <LeaderboardItem nickname="닉네임4" rank={4} point={25} />
        <LeaderboardItem nickname="닉네임5" rank={5} point={20} />
        <LeaderboardItem nickname="닉네임6" rank={6} point={2} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col sticky bottom-0 z-10 rounded-t-xl -ml-10 w-screen bg-primary transition-all duration-200 flex-grow ${
        isExpanded ? 'h-[60vh]' : 'h-20'
      }`}
    >
      <LeaderboardHeader />
      <LeaderboardContent />
    </div>
  );
}

function LeaderboardItem({
  rank,
  nickname,
  point,
}: {
  rank: number;
  nickname: string;
  point: number;
}) {
  return (
    <div className="flex items-center bg-black bg-opacity-75 h-12 min-h-12 rounded-xl px-4 text-sm">
      <div className="bold">{rank}</div>
      <div className="bold ml-4">{nickname}</div>
      <Image src={Key} alt="image of a key" className="w-6 h-6 ml-2" />
      <div className="ml-auto">{point.toLocaleString()}</div>
    </div>
  );
}
