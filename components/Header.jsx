// import React, { useEffect } from "react";
// import { useMoralis } from "react-moralis";

// const Header = () => {
//   const { enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3 } =
//     useMoralis();

//   useEffect(() => {
//     if (isWeb3Enabled) return;
//     if (typeof window !== "undefined") {
//       if (window.localStorage.getItem("connected")) {
//         enableWeb3();
//       }
//     }
//   }, [isWeb3Enabled]);

//   useEffect(() => {
//     Moralis.onAccountChanged((account) => {
//       if (account == null) {
//         window.localStorage.removeItem("connected");
//         deactivateWeb3();
//       }
//     });
//   }, []);

//   return (
//     <>
//       {account ? (
//         <p>
//           Connected to{" "}
//           <span className="text-gray-400">
//             {account.slice(0, 6)}... {account.slice(account.length - 4)}
//           </span>
//         </p>
//       ) : (
//         <button
//           className="ml-7 mt-7 bg-slate-400 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
//           onClick={async () => {
//             await enableWeb3();
//             if (typeof window !== "undefined") {
//               window.localStorage.setItem("connected", "injected");
//             }
//           }}
//         >
//           Connect
//         </button>
//       )}
//     </>
//   );
// };

// export default Header;

import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const useLocalStorage = () => {
  const setConnected = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("connected", "injected");
    }
  };

  const removeConnected = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("connected");
    }
  };

  return { setConnected, removeConnected };
};

const ConnectButton = ({ enableWeb3, isWeb3EnableLoading }) => {
  const { setConnected } = useLocalStorage();

  const handleConnect = async () => {
    await enableWeb3();
    setConnected();
  };

  return (
    <button
      className="ml-7 mt-7 bg-slate-400 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleConnect}
      disabled={isWeb3EnableLoading}
    >
      Connect
    </button>
  );
};

const ConnectedMessage = ({ account }) => {
  return (
    <p>
      Connected to{" "}
      <span className="text-gray-400">
        {account.slice(0, 6)}... {account.slice(account.length - 4)}
      </span>
    </p>
  );
};

const Header = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  const { removeConnected } = useLocalStorage();

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (account === null) {
        removeConnected();
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3, removeConnected]);

  return (
    <>
      {account ? (
        <ConnectedMessage account={account} />
      ) : (
        <ConnectButton
          enableWeb3={enableWeb3}
          isWeb3EnableLoading={isWeb3EnableLoading}
        />
      )}
    </>
  );
};

export default Header;
