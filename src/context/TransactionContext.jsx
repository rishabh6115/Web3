import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import BN from "bn.js";
import { blockTimestampToViewFormatter } from "../utils/timeFormat";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
  if (ethereum) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    return transactionContract;
  }
  return null;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  // ethereum.on('accountsChanged', (accounts) => {
  //     console.log(accounts);
  //     setCurrentAccount(accounts[0])
  // });

  useEffect(() => {
    if (currentAccount[0]) {
      fetchAllTransactions();
    }
  }, [currentAccount]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        const account = accounts[0];
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("connectWallet accounts", accounts);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const transactionContract = await getEthereumContract();
      const allTransactions = await transactionContract.getAllTransactions();

      let structuredTransactions = allTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.from,
        timestamp: blockTimestampToViewFormatter(transaction.timestamp),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: ethers.formatEther(transaction.amount),
      }));
      structuredTransactions = structuredTransactions.reverse();
      setAllTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    const transactionContract = await getEthereumContract();

    const { addressTo, amount, keyword, message } = formData;
    console.log("currentAccount", currentAccount);
    console.log(formData);
    const parsedAmount = ethers.parseEther(amount);
    const parsedAmountBN = new BN(parsedAmount, 10);
    console.log(parsedAmount);
    // It has been abandoned, use BN.js
    console.log(parsedAmount._hex);
    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            value: parsedAmountBN.toString(16),
          },
        ],
      })
      .then((txHash) => console.log("ethereum txhash", txHash))
      .catch((error) => console.error(error));

    const transactionHash = await transactionContract.addToBlockChain(
      addressTo,
      parsedAmount,
      message,
      keyword
    );

    console.log("transactionHash", transactionHash.hash);
    const count = await transactionContract.getTransactionCount();
    console.log(count);
    setTransactionCount(count);
    setIsLoading(true);
    await transactionHash.wait();
    setIsLoading(false);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        isLoading,
        transactionCount,
        allTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
