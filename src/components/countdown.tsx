'use client';

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

export default function Countdown() {
  return (
    <>
      <p className="text-center text-sm font-semibold mb-2">공개까지</p>
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
    </>
  );
}
