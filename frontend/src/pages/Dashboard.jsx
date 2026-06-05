import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAccounts } from "../services/accountService"

const Dashboard = () => {

  const navigate = useNavigate()
const [accounts, setAccounts] = useState([])
  const handleLogout=()=>{
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
  useEffect(()=>{
    fetchAccounts()
  },[])
  return (
    <div>
      <h1>Dashboard</h1>

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />
            <h2>Your Accounts</h2>
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

                        <hr />

                    </div>
                ))
            }
    </div>
   
  )
}

export default Dashboard