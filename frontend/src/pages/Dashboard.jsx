import React, { useEffect, useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/Dashboard.css"
import {
  getAccounts,
  createAccount
} from "../services/accountService"

import AiAssistant from '../components/AiAssistant'
import '../styles/SpendingSummary.css'
import '../components/SpendingSummary';
import SpendingSummary from '../components/SpendingSummary'
 import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getRecentTransactions,
  getAllTransactionsByAccount
} from "../services/transactionService";
const Dashboard = () => {

  const navigate = useNavigate()

 const [accounts,        setAccounts]        = useState([])
  const [amounts,         setAmounts]          = useState({})
  const [notes,           setNotes]            = useState({})
  const [transferData,    setTransferData]     = useState({})
  const [loading,         setLoading]          = useState(false)
  const [transactions,    setTransactions]     = useState({})   // per-account panel
  const [allTransactions, setAllTransactions]  = useState([])   // full history for SpendingSummary
 
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
 
  const totalDeposits = allTransactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + Number(t.amount), 0)
 
  const totalWithdrawals = allTransactions
    .filter(t => t.type === 'WITHDRAW')
    .reduce((sum, t) => sum + Number(t.amount), 0)
 
  const totalTransfers = allTransactions
    .filter(t => t.type === 'TRANSFER_OUT')
    .reduce((sum, t) => sum + Number(t.amount), 0)
 
 
  const fetchAllTransactionsForSummary = async (loadedAccounts) => {
    try {
      const results = await Promise.all(
        loadedAccounts.map(acc => getAllTransactionsByAccount(acc.accountNumber))
      )
      setAllTransactions(results.flat())
    } catch (err) {
      console.error('Failed to load transaction history for summary:', err)
    }
  }
 
  const fetchAccounts = async () => {
    try {
      const data = await getAccounts()
      setAccounts(data)
      fetchAllTransactionsForSummary(data)
    } catch (error) {
      console.error(error)
      alert('Failed to fetch accounts')
    }
  }
 
  useEffect(() => {
    fetchAccounts()
  }, [])
 
  const handleDeposit = async (accountNumber) => {
    try {
      setLoading(true)
      await depositMoney(accountNumber, amounts[accountNumber], notes[accountNumber])
      await fetchAccounts()
      alert('Deposit successful')
    } catch (error) {
      console.error(error)
      alert('Deposit Failed')
    } finally {
      setLoading(false)
    }
  }
 
  const handleWithdraw = async (accountNumber) => {
    try {
      setLoading(true)
      await withdrawMoney(accountNumber, amounts[accountNumber], notes[accountNumber])
      await fetchAccounts()
      alert('Withdrawal Successful')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }
 
  const handleTransfer = async (fromAccount) => {
    try {
      setLoading(true)
      const transfer = transferData[fromAccount]
      await transferMoney(fromAccount, transfer.toAccount, transfer.amount, transfer.note)
      await fetchAccounts()
      alert('Transfer Successful')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }
 
  const handleShowTransactions = async (accountNumber) => {
    try {
      setLoading(true)
      const data = await getRecentTransactions(accountNumber)
      setTransactions(prev => ({ ...prev, [accountNumber]: data }))
    } catch (error) {
      console.error(error)
      alert('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }
 
  const handleCreateAccount = async () => {
    try {
      await createAccount()
      fetchAccounts()
      alert('Account created successfully')
    } catch (error) {
      console.error(error)
      alert('Failed to create account')
    }
  }
 
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }
 
  return (
    <div className="dashboard-container">
 
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
 
      <div className="summary-stats-card">
        <div className="stat-block">
          <span className="stat-label">Total Balance</span>
          <span className="stat-value">₹{totalBalance.toFixed(2)}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">Deposits</span>
          <span className="stat-value positive">₹{totalDeposits.toFixed(2)}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">Withdrawals</span>
          <span className="stat-value negative">₹{totalWithdrawals.toFixed(2)}</span>
        </div>
        <div className="stat-block">
          <span className="stat-label">Transfers</span>
          <span className="stat-value neutral">₹{totalTransfers.toFixed(2)}</span>
        </div>
      </div>
 
      <div className="dashboard-body">
 
        <div className="dashboard-left">
 
          
          <SpendingSummary transactions={allTransactions} />
 
          <div className="section-header">
            <h2>Your Accounts</h2>
            <button className="create-account-btn" onClick={handleCreateAccount}>
              + Create Account
            </button>
          </div>
 
          <div className="accounts-container">
            {accounts.length === 0 && (
              <div className="empty-state">
                No accounts yet. Create one to get started.
              </div>
            )}
 
            {accounts.map((account) => (
              <div className="account-card" key={account.accountNumber}>
 
                <div className="account-card-header">
                  <div>
                    <p className="account-number">Account No. {account.accountNumber}</p>
                    <p className="account-balance">₹{account.balance}</p>
                  </div>
                </div>
 
                <span className="account-status">{account.status}</span>
 
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amounts[account.accountNumber] || ''}
                  onChange={(e) =>
                    setAmounts({ ...amounts, [account.accountNumber]: e.target.value })
                  }
                />
 
                <input
                  type="text"
                  className="note-input"
                  placeholder="What's this for? e.g. Zomato order (optional)"
                  value={notes[account.accountNumber] || ''}
                  onChange={(e) =>
                    setNotes({ ...notes, [account.accountNumber]: e.target.value })
                  }
                />
 
                <div className="account-actions">
                  <button
                    className="btn-primary"
                    disabled={loading}
                    onClick={() => handleDeposit(account.accountNumber)}
                  >
                    {loading ? 'Processing...' : 'Deposit'}
                  </button>
                  <button
                    className="btn-secondary"
                    disabled={loading}
                    onClick={() => handleWithdraw(account.accountNumber)}
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
 
                <div className="transfer-section">
                  <div className="transfer-row">
                    <input
                      type="text"
                      placeholder="Receiver Account Number"
                      value={transferData[account.accountNumber]?.toAccount || ''}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          [account.accountNumber]: {
                            ...transferData[account.accountNumber],
                            toAccount: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Transfer Amount"
                      value={transferData[account.accountNumber]?.amount || ''}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          [account.accountNumber]: {
                            ...transferData[account.accountNumber],
                            amount: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <input
                    type="text"
                    className="note-input"
                    placeholder="What's this for? e.g. Rent (optional)"
                    value={transferData[account.accountNumber]?.note || ''}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        [account.accountNumber]: {
                          ...transferData[account.accountNumber],
                          note: e.target.value,
                        },
                      })
                    }
                  />
                  <button
                    className="btn-primary"
                    disabled={loading}
                    onClick={() => handleTransfer(account.accountNumber)}
                  >
                    {loading ? 'Processing...' : 'Transfer'}
                  </button>
                </div>
 
                <button
                  className="show-tx-btn"
                  onClick={() => handleShowTransactions(account.accountNumber)}
                >
                  Show Recent Transactions
                </button>
 
                <div className="transaction-section">
                  {transactions[account.accountNumber]?.map((transaction) => (
                    <div className="transaction-item" key={transaction.id}>
                      <p>{transaction.type}</p>
                      <p>₹{transaction.amount}</p>
                      <p>{transaction.description}</p>
                      <p>{transaction.createdAt}</p>
                    </div>
                  ))}
                </div>
 
              </div>
            ))}
          </div>
        </div>
 
        <div className="dashboard-right">
          <AiAssistant />
        </div>
 
      </div>
    </div>
  )
}
 
export default Dashboard