import { Gamja_Flower } from 'next/font/google';
import Countdown from '@/components/countdown';
import Leaderboard from './leaderboard';
import { cookies, headers } from 'next/headers';
import { makeRandomSecretString } from '@/lib/secret';
import Key from './key';
import Link from 'next/link';
import { MdHome } from 'react-icons/md';
import KakaoAdfit from '@/components/kakaoAdfit';
import SideMenu from '@/components/sideMenu';

const gamja = Gamja_Flower({
  subsets: ['latin'],
  weight: '400',
});

export default async function SecretPage({
  params,
}: {
  params: Promise<{ secretId: string }>;
}) {
  const secretId = (await params).secretId;
  const headersList = await headers();
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get('jwtToken');
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto');

  const response = await fetch(
    `${protocol}://${host}/api/secret?secretId=${secretId}`,
    {
      headers: {
        Cookie: `jwtToken=${jwtToken?.value}`,
      },
    }
  );
  const data = await response.json();
  const nickname: string = data.ownerNickname;
  const hint: string = data.hint;
  const content: string | undefined = data.content;
  const contentLength: number | undefined = data.contentLength;
  const revealCount: number = data.revealCount;

  return (
    <>
      <SideMenu />
      <div className="flex flex-col h-screen">
        <Link href="/" className="absolute top-3 left-3">
          <MdHome className="w-6 h-6" />
        </Link>
        <div className={`flex flex-col`}>
          <h1 className="text-2xl font-semibold text-center mt-[60px] mb-8">
            <span className="text-primary">{nickname}</span>님의 비밀
          </h1>
          <Countdown />
          <div className="w-full mt-7">
            <label className="text-sm font-semibold text-gray ml-2">
              비밀 힌트
            </label>
            <div
              className={`flex items-center justify-center w-full h-[60px] border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm ${gamja.className}`}
            >
              {hint}
            </div>
          </div>
          <div className="w-full mt-4">
            <label className="text-sm font-semibold text-gray ml-2">
              비밀 내용{content && ' (나만 볼 수 있어요)'}
            </label>
            <div
              className={`w-full break-words p-3 overflow-y-scroll border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm scrollbar-hide ${gamja.className}`}
            >
              <div className={`${!content && 'blur-sm'}`}>
                {content ? content : makeRandomSecretString(contentLength!)}
              </div>
            </div>
          </div>
          <p className="text-gray text-sm text-center mt-4">
            2024. 12. 24. 22:00 기준
            <br />
            클릭 수 상위 {revealCount}명에게만
            <br />
            비밀이 공유돼요.
          </p>
          <Key secretId={secretId} />
        </div>
        <KakaoAdfit />
        <Leaderboard secretId={secretId} revealCount={revealCount} />
      </div>
    </>
  );
}
