'use client';

import { FiLink } from 'react-icons/fi';
import { useState } from 'react';

export default function LinkButton({ secretId }: { secretId: string }) {
  const [buttonToggle, setButtonToggle] = useState(true);

  return (
    <button
      className="flex items-center gap-2 justify-center w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-6"
      onClick={() => {
        setButtonToggle(false);
        setTimeout(() => setButtonToggle(true), 300);
        const { protocol, host, pathname } = window.location;
        navigator.clipboard.writeText(
          `${protocol}//${host}/secret/${secretId}`
        );
      }}
    >
      {buttonToggle ? (
        <>
          <FiLink />
          링크 복사하기
        </>
      ) : (
        <span className="text-sm">클립보드에 복사되었습니다.</span>
      )}
    </button>
  );
}
