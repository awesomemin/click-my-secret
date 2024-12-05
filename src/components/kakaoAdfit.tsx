'use client';

import { useEffect, useRef } from 'react';

export default function KakaoAdfit() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', '//t1.daumcdn.net/kas/static/ba.min.js');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('async', 'true');
    divRef.current?.appendChild(script);
  }, []);
  return (
    <div ref={divRef} className="w-screen -ml-10 flex justify-center">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none', width: '100%' }}
        data-ad-unit="DAN-qoMYmCBfhTRtBEk6"
        data-ad-width="320"
        data-ad-height="100"
      />
    </div>
  );
}
