import React, { createContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem("walletAddress");
  });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      checkConnection();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = accounts[0].address;
          setAddress(address);
          localStorage.setItem("walletAddress", address);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0]);
      localStorage.setItem("walletAddress", accounts[0]);
    } else {
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    localStorage.removeItem("walletAddress");
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.info("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      localStorage.setItem("walletAddress", accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem("walletAddress");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
