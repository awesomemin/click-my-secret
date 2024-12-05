'use client';

import Key from '@/../public/key.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Leaderboard({
  secretId,
  revealCount,
}: {
  secretId: string;
  revealCount: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<
    { nickname: string; clickCount: number; isMe: boolean }[]
  >([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLeaderboardData();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  async function fetchLeaderboardData() {
    const response = await fetch(`/api/click?secretId=${secretId}`);
    const data: {
      leaderboard: { nickname: string; clickCount: number; isMe: boolean }[];
    } = await response.json();
    if (!response.ok) {
      console.error('어떡하지...');
    }
    data.leaderboard.sort((a, b) => b.clickCount - a.clickCount);
    setLeaderboardData(data.leaderboard);
  }

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
        {leaderboardData.map((user, i) => (
          <LeaderboardItem
            key={user.nickname}
            nickname={user.nickname}
            rank={i + 1}
            point={user.clickCount}
            isMe={user.isMe}
          />
        ))}
      </div>
    );
  }

  function LeaderboardItem({
    rank,
    nickname,
    point,
    isMe,
  }: {
    rank: number;
    nickname: string;
    point: number;
    isMe: boolean;
  }) {
    return (
      <div
        className={`flex items-center h-12 min-h-12 rounded-xl px-4 text-sm ${
          isMe ? 'bg-[#F9F871] text-black' : 'bg-black bg-opacity-75'
        }`}
      >
        <div className="bold">{rank}</div>
        <div className="bold ml-4">{nickname}</div>
        {rank <= revealCount && (
          <Image src={Key} alt="image of a key" className="w-6 h-6 ml-2" />
        )}
        <div className="ml-auto">{point.toLocaleString()}</div>
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
