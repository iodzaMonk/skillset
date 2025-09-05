import Image from 'next/image';
import Content from './posts/page';
export default function Home() {
  return (
    <header className="flex w-full h-[100] justify-center items-center bg-gradient-to-b from-fuchsia-800/40 to-fuchsia-700/20 shadow-md">
      <div className="flex w-3/5 justify-end">
        <button className="bg-fuchsia-600/70 text-white p-3 rounded-md mr-5">
          Create account
        </button>
        <div className="w-15 h-15 rounded-full bg-amber-50 mr-5 ml-5"></div>
      </div>
    </header>
  );
}
