import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/Dashboard.css"
import {
  getAccounts,
  createAccount
} from "../services/accountService"
import { depositMoney, withdrawMoney, transferMoney, getRecentTransactions } from '../services/transactionService'

const Dashboard = () => {

  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])

  const [amounts, setAmounts] = useState({})
   
  const [transferData,setTransferData]=useState({});

  const [loading,setLoading] = useState(false)

  const[transactions,setTransactions] = useState({});
  const handleDeposit = async (accountNumber) => {
    try{
      setLoading(true)
      const amount = amounts[accountNumber]

    await depositMoney(
      accountNumber,
      amount
    )

    fetchAccounts()

    alert("Deposit successful")
    }
    catch(error)
    {
     console.log(error);
     alert("Deposit Failed")
     
    }
    finally{
      setLoading(false)
    }
  }

  const handleShowTransactions = async (accountNumber) => {
    try {
      setLoading(true)
      const data = await getRecentTransactions(
        accountNumber
      )
      setTransactions({
        ...transactions,
        [accountNumber] : data
      })
    } catch (error) {
      console.log(error);
      alert("FAILED to fetch transactions")
      
    }
    finally{
      setLoading(false)
    }
  }

  const handleTransfer = async (fromAccount) => {
    try{
      setLoading(true)
      const transfer = transferData[fromAccount]

      await transferMoney(
        fromAccount,
        transfer.toAccount,
        transfer.amount
      )

      fetchAccounts()
      alert("Transfer Successful")
    }
    catch(error) {
      console.log(error);

         if(error.response?.data?.message) {

      alert(error.response.data.message)
    }
    else {

      alert("Transfer failed")
    }
      
    }
    finally{
      setLoading(false)
    }
  }

  const handleWithdraw = async(accountNumber) => {
    try{
         
      setLoading(true)
         const amount = amounts[accountNumber]

         await withdrawMoney(
          accountNumber,
          amount
         )

         fetchAccounts()
         alert("Withdrawal Successful")
    }
    catch(error) {
        console.log(error);

    if(error.response?.data?.message) {

      alert(error.response.data.message)
    }
    else {

      alert("Withdrawal failed")
        
    }
  }
  finally{
    setLoading(false)
  }
}

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/")
  }

  const fetchAccounts = async () => {

    try {

      const data = await getAccounts()

      

      setAccounts(data)

    }
    catch(error) {

      console.log(error)

      alert("Failed to fetch accounts")
    }
  }

  const handleCreateAccount = async () => {

    try {

      await createAccount()

      fetchAccounts()

      alert("Account created successfully")
    }
    catch(error) {

      console.log(error)

      alert("Failed to create account")
    }
  }

  useEffect(() => {

    fetchAccounts()

  }, [])

  return (

    <div className='dashboard-container'>

      <h1 className='dashboard-title'>Dashboard</h1>

      <button className='logout-button' onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Your Accounts</h2>

      <button onClick={handleCreateAccount}>
        Create Account
      </button>

<div className='accounts-container'>
      {
        accounts.map((account) => (

          <div className='account-card' key={account.accountNumber}>

            <p>
              Account Number:
              {account.accountNumber}
            </p>

            <p>
              Balance:
              {account.balance}
            </p>

            <p>
              Status:
              {account.status}
            </p>

            <input type='number' placeholder='Enter Amount' value={amounts[account.accountNumber] || ""
                       }
                       onChange={(e)=>
                        setAmounts({
                          ...amounts, [account.accountNumber]: e.target.value
                        })
                       }
                       />
 <button
  disabled={loading}

  onClick={() =>
    handleDeposit(account.accountNumber)
  }
>

  {
    loading
      ? "Processing..."
      : "Deposit"
  }
  

</button>
<button
  disabled={loading}

  onClick={() =>
    handleWithdraw(account.accountNumber)
  }
>

  {
    loading
      ? "Processing..."
      : "Withdraw"
  }
  

</button>

<div>

  <input
    type="text"
    placeholder="Receiver Account Number"

    value={
      transferData[
        account.accountNumber
      ]?.toAccount || ""
    }

    onChange={(e) =>

      setTransferData({

        ...transferData,

        [account.accountNumber]: {

          ...transferData[
            account.accountNumber
          ],

          toAccount: e.target.value
        }
      })
    }
  />

  <input
    type="number"
    placeholder="Transfer Amount"

    value={
      transferData[
        account.accountNumber
      ]?.amount || ""
    }

    onChange={(e) =>

      setTransferData({

        ...transferData,

        [account.accountNumber]: {

          ...transferData[
            account.accountNumber
          ],

          amount: e.target.value
        }
      })
    }
  />

  <button
  disabled={loading}

  onClick={() =>
    handleTransfer(account.accountNumber)
  }
>

  {
    loading
      ? "Processing..."
      : "Transfer"
  }

</button>
  <button
  onClick={() =>
    handleShowTransactions(
      account.accountNumber
    )
  }
>
  Show Recent Transactions
</button>
<div className="transaction-section">

{
  transactions[
    account.accountNumber
  ]?.map((transaction) => (

    <div className="transaction-item" key={transaction.id}>

      <p>
        Type:
        {transaction.type}
      </p>

      <p>
        Amount:
        {transaction.amount}
      </p>

      <p>
        Description:
        {transaction.description}
      </p>

      <p>
        Date:
        {transaction.createdAt}
      </p>

      <hr />

    </div>
  ))
}
</div>

</div>

            <hr />

          </div>
        ))
      }
      </div>

    </div>
  )
}

export default Dashboard