'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';

export default function SideMenu() {
  const router = useRouter();
  const [menuOn, setMenuOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkMyInfo = async () => {
      const response = await fetch(`/api/auth/me`);
      const myInfo = await response.json();
      console.log(myInfo);
      if (!response.ok || myInfo.loggedIn === false) {
        setIsLoggedIn(false);
      }
      setIsLoggedIn(myInfo.loggedIn);
    };
    checkMyInfo();
  }, []);
  return (
    <>
      <MdMenu
        className="absolute top-3 right-3 w-6 h-6"
        onClick={() => {
          setMenuOn((p) => !p);
        }}
      />
      <div
        className={`${
          menuOn ? 'fixed bg-opacity-50' : 'hidden bg-opacity-100'
        } inset-0 z-20 bg-black transition-opacity`}
        onClick={() => setMenuOn((p) => !p)}
      />
      <div
        className={`${
          menuOn ? 'translate-x-0' : 'translate-x-full'
        } fixed flex flex-col pl-6 pt-6 gap-4 right-0 z-30 h-screen w-60 bg-background transition-transform duration-300 ease-in-out`}
      >
        {isLoggedIn ? (
          <>
            <div
              onClick={async () => {
                const response = await fetch('/api/auth/logout', {
                  method: 'POST',
                });
                if (response.ok) {
                  setIsLoggedIn(false);
                }
              }}
            >
              로그아웃
            </div>
            <div
              onClick={async () => {
                const response = await fetch('api/secret/my');
                const data = await response.json();
                if (response.ok) {
                  const secretId = data.secretId;
                  router.push(`/secret/${secretId}`);
                } else if (response.status === 404) {
                  router.push(`/secret/make`);
                }
              }}
            >
              내 비밀 보러 가기
            </div>
            <div
              onClick={() => {
                router.push(`/click/my`);
              }}
            >
              내가 클릭한 비밀 모아보기
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                router.push('/login');
              }}
            >
              로그인
            </div>
            <div
              onClick={() => {
                router.push('/signup');
              }}
            >
              회원가입
            </div>
          </>
        )}
      </div>
    </>
  );
}
