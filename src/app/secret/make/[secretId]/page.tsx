import { Gamja_Flower } from 'next/font/google';
import { FiLink } from 'react-icons/fi';

const gamja = Gamja_Flower({
  subsets: ['latin'],
  weight: '400',
});

export default function SecretComplete() {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-2xl font text-center mt-[60px]">축하합니다!</h2>
        <h2 className="font-semibold text-xl text-center mt-9">
          <span className="text-primary">{'어썸민'}</span>님의 비밀이
          완성되었어요
        </h2>
        <div className="w-full mt-7">
          <label className="text-sm font-semibold text-gray ml-2">
            비밀 힌트
          </label>
          <div
            className={`flex items-center justify-center w-full h-[60px] border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm ${gamja.className}`}
          >
            {'비밀 힌트'}
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="text-sm font-semibold text-gray ml-2">
            비밀 내용{' '}
            <span className="font-normal">(지금은 나만 볼 수 있어요)</span>
          </label>
          <div
            className={`w-full h-80 p-3 overflow-scroll border border-lightGray rounded-2xl bg-inputBg mt-2 text-sm ${gamja.className}`}
          >
            {'비밀 내용'}
          </div>
        </div>
        <p className="text-center mt-6">
          2024. 12. 24. 22:00 기준
          <br />
          클릭 수 상위 {5}명에게만
          <br />
          나의 비밀이 공유돼요
        </p>
        <button className="flex items-center gap-2 justify-center w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-6">
          <FiLink />
          링크 복사하기
        </button>
        <button className="w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-6 mb-[60px]">
          완료
        </button>
      </div>
    </>
  );
}
