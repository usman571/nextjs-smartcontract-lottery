import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); //pull out chainId obj and rename it as chainIdHex
  const chainId = parseInt(chainIdHex); //create new var called chainId
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // console.log(raffleAddress);

  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    msgValue: entranceFee,
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getPlayersNumber()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div>
      Hi,i'm from lottery entrance
      {raffleAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onerror: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-2 rounded mr-3 mt-1"
          >
            {isLoading || isFetching ? (
              // <div className="animate-spin spinner-border h-[26px] w-[26px] border-b-2 rounded-full"></div>
              <div className="w-6 h-6 rounded-full border-2 border-t-2 border-gray-600 transform rotate-45"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div className="flex flex-col gap-2">
            <span>
              EntranceFee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </span>
            <span>Players: {numberOfPlayers}</span>
            <span>RecentWinner: {recentWinner}</span>
            
          </div>
        </div>
      ) : (
        <div> No Raffle Address Detected</div>
      )}
    </div>
  );
}
