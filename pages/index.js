import { Inter } from "@next/font/google";
import LotteryEntrance from "../components/LotteryEntrance";
import MyHeader from "../components/MyHeader";
const inter = Inter({ subsets: ["latin"] });
// import Header from '../components/Header'
export default function Home() {
  return (
    <>
      <MyHeader />
      <div className=" flex items-center flex-col gap-4 mt-32">
        {/* <Header/> */}
        <h1 className="text-blue-500 text-4xl">Check your luck </h1>
        <LotteryEntrance />
      </div>
    </>
  );
}
