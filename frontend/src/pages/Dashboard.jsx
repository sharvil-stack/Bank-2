import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getAccounts,
  createAccount
} from "../services/accountService"
import { depositMoney, withdrawMoney, transferMoney } from '../services/transactionService'

const Dashboard = () => {

  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])

  const [amounts, setAmounts] = useState({})
   
  const [transferData,setTransferData]=useState({});
  const handleDeposit = async (accountNumber) => {
    try{
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
  }

  const handleTransfer = async (fromAccount) => {
    try{
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
  }

  const handleWithdraw = async(accountNumber) => {
    try{
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

    <div>

      <h1>Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Your Accounts</h2>

      <button onClick={handleCreateAccount}>
        Create Account
      </button>

      {
        accounts.map((account) => (

          <div key={account.accountNumber}>

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
  onClick={() =>
    handleDeposit(
      account.accountNumber
    )
  }
>
  Deposit
</button>
<button
  onClick={() =>
    handleWithdraw(
      account.accountNumber
    )
  }
>
  Withdraw
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
    onClick={() =>
      handleTransfer(
        account.accountNumber
      )
    }
  >
    Transfer
  </button>

</div>

            <hr />

          </div>
        ))
      }

    </div>
  )
}

export default Dashboard