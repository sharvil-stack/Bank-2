import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  registerUser
}
from "../services/authService"
import '../styles/Auth.css'


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
   
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Finova</div>
        <h1 className="auth-title">Create your account</h1>

        <form className="auth-form" onSubmit={handleRegister}>

          <div className="auth-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

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

          <button type="submit" className="btn-primary auth-submit">
            Register
          </button>

        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button onClick={() => navigate("/")}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register