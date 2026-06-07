import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getAccounts,
  createAccount
} from "../services/accountService"
import { depositMoney } from '../services/transactionService'

const Dashboard = () => {

  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([])

  const [amounts, setAmounts] = useState({})

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

            <hr />

          </div>
        ))
      }

    </div>
  )
}

export default Dashboard