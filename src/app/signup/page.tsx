import { MdPerson, MdLock, MdTagFaces } from 'react-icons/md';

export default function SignUp() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <h1 className="mt-[60px] text-2xl font-semibold">
          ID와 비밀번호 입력만으로
          <br />
          10초만에 시작해요
        </h1>
        <form className="mt-[55px]">
          <label className="text-sm font-semibold text-gray ml-2 mb-2">
            ID
          </label>
          <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-8">
            <MdPerson className="ml-[18px] text-lightGray w-6 h-6" />
            <input className="w-full mx-3 bg-background outline-none"></input>
          </div>
          <label className="text-sm font-semibold text-gray ml-2 mb-2">
            비밀번호
          </label>
          <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-8">
            <MdLock className="ml-[18px] text-lightGray w-6 h-6" />
            <input className="w-full mx-3 bg-background outline-none"></input>
          </div>
          <label className="text-sm font-semibold text-gray ml-2 mb-2">
            닉네임
          </label>
          <div className="flex items-center w-full h-[60px] border border-lightGray rounded-2xl bg-background mb-8">
            <MdTagFaces className="ml-[18px] text-lightGray w-6 h-6" />
            <input className="w-full mx-3 bg-background outline-none"></input>
          </div>
          <button className=" w-full h-16 bg-primary rounded-2xl text-lg font-semibold mt-10">
            회원가입
          </button>
        </form>
        <div className="flex-grow"></div>
        <button className="text-gray text-sm mb-20">이미 회원인가요?</button>
      </div>
    </>
  );
}
