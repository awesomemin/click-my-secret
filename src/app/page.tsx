import Image from 'next/image';
import Lock from '../../public/lock.png';
import Link from 'next/link';
import KakaoAdfit from '@/components/kakaoAdfit';
import SideMenu from '@/components/sideMenu';

export default function Home() {
  return (
    <>
      <SideMenu />
      <div className="flex flex-col items-center h-screen">
        <Image src={Lock} alt="lock image" className="mt-48" />
        <p className="font-semibold text-xl mt-2  ">이번 크리스마스,</p>
        <p className="font-semibold text-2xl text-center">
          가장 많이 클릭한 친구에게만
          <br />
          나의 비밀을 공유해보세요
        </p>
        <div className="flex-grow"></div>
        <Link
          href="/secret/make"
          className="w-full h-16 bg-primary rounded-2xl text-lg font-semibold flex items-center justify-center mb-40"
        >
          비밀 만들러 가기
        </Link>
      </div>
      <div className="fixed bottom-0">
        <KakaoAdfit />
      </div>
    </>
  );
}
