// const YODA_ADDRESS = "0xbd27d0b7F9fedb5A2A2C3ceF5dC9c70f3CF64Af2"; // bina deployed
const YODA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CARVING_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import cbABI from "../abi/CarvingBlock.json";
import yodaABI from "../abi/IERC20.json";

type WalletContextType = {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isSeller: boolean;
  connectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isSeller, setIsSeller] = useState(false);

  const checkIfSeller = (addr: string, provider: ethers.BrowserProvider) => {
    const contract = new ethers.Contract(CARVING_ADDRESS, cbABI, provider);
    console.log("CHECKING IF SELLER:", addr)

    return contract.seller()
      .then((seller: string) => {
        const result = addr.toLowerCase() === seller.toLowerCase();
        setIsSeller(result);
        if (result) console.log("IS SELLER")
        else console.log("NOT SELLER")
      })
      .catch((err: any) => {
        console.error("checkIfSeller failed:", err);
        setIsSeller(false);
      });
  };


  // NEED TO APPROVE SC SO FUND TRANSFER CAN HAPPEN BUYER <--> SC --> SELLER
  const ensureApproval = (signer: ethers.JsonRpcSigner) => {
    const yoda = new ethers.Contract(YODA_ADDRESS, yodaABI, signer);

    const owner = signer.getAddress();

    return Promise.all([
      yoda.allowance(owner, CARVING_ADDRESS),
      yoda.balanceOf(owner)
    ]).then(([allowance, balance]) => {
      if (allowance >= balance) return;

      return yoda.approve(CARVING_ADDRESS, 100000);
    });
  };

  const connectWallet = () => {
    if (!window.ethereum) {
      console.error("No wallet detected");
      return;
    }

    window.ethereum.request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        ethersProvider.getNetwork().then(console.log);

        return ethersProvider.getSigner().then((ethersSigner) => {
          const addr = accounts[0];

          setAddress(addr);
          setProvider(ethersProvider);
          setSigner(ethersSigner);

          return Promise.all([
            checkIfSeller(addr, ethersProvider),
            ensureApproval(ethersSigner)
          ]);
        });
      })
      .catch((err: any) => {
        console.error("MetaMask error:", err);
      });

  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("ACCOUNTS CHANGED");
      const newAddr = accounts[0] || null;
      setAddress(newAddr);

      console.log("ADD:", newAddr, "PROV:", provider, "SIGN:", signer)
      if (newAddr && provider) {
        provider.getSigner().then((signer) => {
          setSigner(signer);
          ensureApproval(signer);
        });
        checkIfSeller(newAddr, provider);
      } else {
        setIsSeller(false);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [provider, signer]);

  return (
    <WalletContext.Provider
      value={{ address, provider, signer, isSeller, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
};

export const useCarvingBlock = () => {
  const { signer } = useWallet();

  return useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(CARVING_ADDRESS, cbABI, signer);
  }, [signer]);
};

export const useYoda = () => {
  const { signer } = useWallet();

  return useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(YODA_ADDRESS, yodaABI, signer);
  }, [signer]);
};