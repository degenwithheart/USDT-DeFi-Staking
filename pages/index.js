import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { gql, request } from 'graphql-request'

const SUBGRAPH_URL = '<YOUR_SUBGRAPH_URL>'

export default function Home() {
  const { address, contract, error } = useWeb3()
  const [amount, setAmount] = useState('')
  const [pending, setPending] = useState('0')
  const [loading, setLoading] = useState(false)
  const [txs, setTxs] = useState([])

  const fetchPending = async () => {
    if (!contract || !address) return
    const val = await contract.getPendingReward(address)
    setPending(ethers.utils.formatUnits(val, 6))
  }

  const fetchTxs = async () => {
    if (!address) return
    const q = gql`
      query($user: String!) {
        stakeTransactions(where: { user: $user }) { id amount timestamp }
        unstakeTransactions(where: { user: $user }) { id amount timestamp }
        claimTransactions(where: { user: $user }) { id reward timestamp }
      }`
    const { stakeTransactions, unstakeTransactions, claimTransactions } = await request(SUBGRAPH_URL, q, { user: address.toLowerCase() })
    setTxs([...stakeTransactions, ...unstakeTransactions, ...claimTransactions].sort((a,b)=>b.timestamp - a.timestamp))
  }

  useEffect(() => { fetchPending(); fetchTxs() }, [contract, address])

  const doTx = async (fn, val) => {
    if (!contract) return
    setLoading(true)
    try {
      await contract[fn](ethers.utils.parseUnits(val, 6))
    } catch (e) {
      console.error(e)
      alert(e.message)
    }
    setLoading(false)
    fetchPending()
    fetchTxs()
  }

  return (
    <div className="p-6 max-w-lg mx-auto dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {error && <p className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 p-2 rounded">{error}</p>}
      <h1 className="text-2xl font-bold mb-4">USDT Staking</h1>
      <input
        type="number"
        placeholder="Amount"
        className="border p-2 w-full mb-4 bg-white dark:bg-gray-800"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <div className="space-x-2 mb-4">
        <button onClick={()=>doTx('stake', amount)} disabled={loading} className="btn-blue">Stake</button>
        <button onClick={()=>doTx('unstake', amount)} disabled={loading} className="btn-red">Unstake</button>
        <button onClick={()=>doTx('claimReward', amount)} disabled={loading} className="btn-green">Claim</button>
      </div>
      <p>Pending Rewards: {pending} USDT</p>
      <h2 className="mt-6 text-xl">Transactions</h2>
      <ul>
        {txs.map(tx => (
          <li key={tx.id}>
            {tx.amount ?? tx.reward} USDT – {new Date(parseInt(tx.timestamp)*1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
