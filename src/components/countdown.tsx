'use client';

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { useEffect, useState } from 'react';

export default function Countdown() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <p className="text-center text-sm font-semibold mb-2">공개까지</p>
      {isClient ? (
        <FlipClockCountdown
          className="flex justify-center"
          to={1735045200000}
          digitBlockStyle={{
            width: 25,
            height: 35,
            fontSize: 20,
            fontWeight: 900,
            backgroundColor: '#43454c',
          }}
          dividerStyle={{ color: 'gray' }}
          separatorStyle={{ size: '3px' }}
          labelStyle={{ fontSize: 10 }}
        />
      ) : (
        <div className="h-[55px] w-[280px] flex justify-around">
          <div className="flex gap-1 relative">
            <div className="text-[10px] absolute left-[50%] translate-x-[-50%] bottom-[3px]">
              Days
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
          </div>
          <div className="flex flex-col gap-[3px] mb-[20px] items-center justify-center">
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
          </div>
          <div className="flex gap-1 relative">
            <div className="text-[10px] absolute left-[50%] translate-x-[-50%] bottom-[3px]">
              Hours
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
          </div>
          <div className="flex flex-col gap-[3px] mb-[20px] items-center justify-center">
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
          </div>
          <div className="flex gap-1 relative">
            <div className="text-[10px] absolute left-[50%] translate-x-[-50%] bottom-[3px]">
              Minutes
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
          </div>
          <div className="flex flex-col gap-[3px] mb-[20px] items-center justify-center">
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
            <div className="w-[3px] h-[3px] bg-white rounded-full" />
          </div>
          <div className="flex gap-1 relative">
            <div className="text-[10px] absolute left-[50%] translate-x-[-50%] bottom-[3px]">
              Seconds
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
            <div className="flex items-center w-[25px] h-[35px] bg-[#43454c] rounded-[4px]">
              <div className="w-full h-[0.8px] bg-gray"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
