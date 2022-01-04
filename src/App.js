import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json'
import './App.css';
import { parseEther } from 'ethers/lib/utils';

let walletAddress = "0xbf7f4C1Fe8b54700F01A01182275e92EDbdbCbAE"

function App() {

  const [balance, setBalance] = useState(0)
  const [amountSent, setAmountSent] = useState()
  const [amountWithdraw, setAmountWithdraw] = useState()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getBalance()
  }, [])

  async function getBalance() {
    if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(walletAddress, Wallet.abi, provider)
      try {
        let overrides = {
          from: accounts[0]
        }
        const data = await contract.getBalance(overrides)
        setBalance(String(data))
      }
      catch (err) {
        setError("Une erreur est survenue.")
      }
    }
  }

  async function transfer() {
    if (!amountSent) {
      return
    }
    setError('')
    setSuccess('')
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      try {
        const tx = {
          from: accounts[0],
          to: walletAddress,
          value: ethers.utils.parseEther(amountSent)
        }
        const transaction = await signer.sendTransaction(tx)
        await transaction.wait()
        setAmountSent('')
        getBalance()
        setSuccess('Votre argent a bien été transféré.')
      }
      catch (err) {
        setError('Une erreur est survenue.')
      }
    }
  }

  async function withdraw() {
    if (!amountWithdraw) {
      return
    }
    setError('')
    setSuccess('')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(walletAddress, Wallet.abi, signer)
    try {
      const transaction = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw))
      await transaction.wait()
      setAmountWithdraw('')
      getBalance()
      setSuccess('Votre argent a bien été retiré du portefeuille.')
    }
    catch (err) {
      setError('Une erreur est survenue.')
    }
  }

  function changeAmountSent(e) {
    setAmountSent(e.target.value)
  }

  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value)
  }

  return (
    <div className="App">
      {error && <p className="error">{error}</p>}
      <h2>{balance / 10 ** 18}eth</h2>
      <div className="wallet_flex">
        <div className='walletG'>
          <h3>Envoyer de l'ether</h3>
          <input type="text" placeholder="Montant en ethers" onChange={changeAmountSent} />
          <button onClick={transfer}>Envoyer</button>
        </div>
        <div className="walletD">
          <h3>Retirer de l'ether</h3>
          <input type="text" placeholder="Montant en Ethers" onChange={changeAmountWithdraw} />
          <button onClick={withdraw}>Retirer </button>
        </div>
      </div>
    </div>
  );
}

export default App;
