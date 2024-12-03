'use client';

import KeyImage from '@/../public/key.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Key({ secretId }: { secretId: string }) {
  const router = useRouter();

  async function handleKeyClick() {
    const response = await fetch(`/api/click?secretId=${secretId}`, {
      method: 'POST',
    });
    const data = await response.json();
    if (data?.redirectUrl) {
      router.push(data.redirectUrl);
    }
  }
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
