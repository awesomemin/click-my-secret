'use client';

import KeyImage from '@/../public/key.png';
import Image from 'next/image';

async function handleKeyClick() {
  await fetch('/api/click', {
    method: 'POST',
  });
}

export default function Key() {
  return (
    <div className="h-24 my-5 mx-auto flex items-center justify-center">
      <Image
        onClick={handleKeyClick}
        src={KeyImage}
        alt="image of a key"
        className="w-24 h-24 mx-auto transition-all duration-75 active:scale-95"
      />
    </div>
  );
}
