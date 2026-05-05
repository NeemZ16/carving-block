import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet, useYoda } from "../hooks/walletContext";
import Button from "./interaction/button";

export default function WalletDetails() {
    const {address, connectWallet} = useWallet();
    const [balance, setBalance] = useState("--");
    const yoda = useYoda();

    useEffect(() => {
        const fetchBalance = async () => {
            if (!yoda || !address) return;

            try {
                console.log("WALLET ADDRESS TRY:", address)
                const raw = await yoda.balanceOf(address);
                const formatted = ethers.formatUnits(raw, 2);
                setBalance(formatted);
            } catch (err) {
                console.error("Failed to fetch balance", err);
                setBalance("--");
            }
        };

        fetchBalance();

    }, [yoda, address])

    if (!address) return (
        <section>
            <h2>Wallet Details</h2>
            <div className="section-content">
                <p>No wallet connected!</p>
                <p><span className="highlight">Address:</span> --</p>
                <p><span className="highlight">Balance:</span> --</p>
                <Button title="connect wallet" action={connectWallet}/>
            </div>
        </section>
    )
    else return (
        <section>
            <h2>Wallet Details</h2>
            <div className="section-content">
                <p><span className="highlight">Address:</span> {address}</p>
                <p><span className="highlight">Balance:</span> {balance} <span style={{color: "var(--green-light)", fontWeight: 600}}>YODA</span></p>
            </div>
        </section>
    )
}