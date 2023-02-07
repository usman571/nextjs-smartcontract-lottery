import React from "react";
import { ConnectButton } from "web3uikit";
const MyHeader = () => {
  return (
    <div className=" p-5 border-b-2 flex flex-row items-center">
      <h1 className="py-4 px-4 text-3xl ">Decentralized Lottery</h1>
      <div className="ml-auto">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default MyHeader;
