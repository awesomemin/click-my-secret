import { MdPerson, MdLock, MdTagFaces } from 'react-icons/md';
import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <h1 className="mt-[60px] text-2xl font-semibold text-center">로그인</h1>
        <form className="mt-[55px]">
          <label className="text-sm font-semibold text-gray ml-2">ID</label>
          <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-6 mt-2">
            <MdPerson className="ml-[18px] text-lightGray w-6 h-6" />
            <input className="w-full mx-3 bg-background outline-none"></input>
          </div>
          <label className="text-sm font-semibold text-gray ml-2">
            비밀번호
          </label>
          <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mt-2">
            <MdLock className="ml-[18px] text-lightGray w-6 h-6" />
            <input className="w-full mx-3 bg-background outline-none"></input>
          </div>

          <button className=" w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-10">
            로그인
          </button>
        </form>
        <div className="flex-grow"></div>
        <Link href="/signup" className="text-center text-gray text-sm mb-20">
          회원이 아니신가요?{' '}
          <span className="text-primary underline">회원가입</span>
        </Link>
      </div>
    </>
  );
}
