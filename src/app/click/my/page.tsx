import { cookies, headers } from 'next/headers';
import { Gamja_Flower } from 'next/font/google';
import { MdHome } from 'react-icons/md';

import Link from 'next/link';
import SideMenu from '@/components/sideMenu';

const gamja = Gamja_Flower({
  subsets: ['latin'],
  weight: '400',
});

interface Secret {
  ownerNickname: string;
  hint: string;
  clickCount: number;
  secretId: string;
  revealCount: number;
}

export default async function ClickedSecretList() {
  const headersList = await headers();
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get('jwtToken');
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto');
  const response = await fetch(`${protocol}://${host}/api/click/my`, {
    headers: {
      Cookie: `jwtToken=${jwtToken?.value}`,
    },
  });
  const secrets: Secret[] = (await response.json()).results;
  console.log(secrets);
  return (
    <>
      <SideMenu />
      <div className="flex flex-col h-screen overflow-hidden">
        <Link href="/" className="absolute top-3 left-3">
          <MdHome className="w-6 h-6" />
        </Link>
        <h1 className="font-semibold text-2xl mt-[60px] text-center mb-5">
          1회 이상 클릭한 비밀
        </h1>
        <div className="flex flex-col gap-4 overflow-auto">
          {secrets.length !== 0 ? (
            secrets.map((secret) => (
              <ClickedSecretItem
                key={secret.secretId}
                ownerNickname={secret.ownerNickname}
                hint={secret.hint}
                clickCount={secret.clickCount}
                secretId={secret.secretId}
                revealCount={secret.revealCount}
              />
            ))
          ) : (
            <div className="text-center mt-16">
              아직 클릭한 비밀이 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ClickedSecretItem({
  ownerNickname,
  hint,
  clickCount,
  secretId,
  revealCount,
}: {
  ownerNickname: string;
  hint: string;
  clickCount: number;
  secretId: string;
  revealCount: number;
}) {
  return (
    <Link
      href={`/secret/${secretId}`}
      className="py-2 px-4 rounded-xl bg-inputBg"
    >
      <h2 className="text-lg ml-1">
        <span className="text-primary text-2xl font-semibold">
          {ownerNickname}
        </span>
        님의 비밀
      </h2>
      <div
        className={`mt-1 flex items-center justify-center bg-inputBg bg-opacity-50 border border-lightGray rounded-xl h-12 ${gamja.className}`}
      >
        {hint}
      </div>
      <div className="flex justify-between mt-2 px-2 text-sm font-light">
        <div className="text-gray text-xs">
          <span className="text-base">{clickCount}회</span> 클릭
        </div>
        <div className="text-gray">{revealCount}명에게 공개</div>
      </div>
    </Link>
  );
}
