import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  registerUser
}
from "../services/authService"


const Register = () => {
    const navigate = useNavigate();

   const [firstName, setFirstName] =
    useState("")

const [lastName, setLastName] =
    useState("")
    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")

    const handleRegister = async (e) => {
         e.preventDefault()
        try {
     await registerUser(
  firstName,
  lastName,
  email,
  password
)

           alert("Registration Successful")

           navigate("/")
        } catch (error) {
            console.log(error);

            if(
                error.response?.data?.message
            ) {
                 alert(
          error.response.data.message
        )
            }
               else {

        alert(
          "Registration failed"
        )
      }
            
        }
    }
  return (
   
    <div>

      <h1>Register</h1>

      <form
        onSubmit={handleRegister}
      >

        <input
  type="text"
  placeholder="First Name"
  value={firstName}
  onChange={(e) =>
    setFirstName(e.target.value)
  }
/>

<br />
<br />

<input
  type="text"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) =>
    setLastName(e.target.value)
  }
/>

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  )
}

export default Register