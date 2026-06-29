import React, { useState } from 'react'
import { loginUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'
const Login = () => {
    const [email,setEmail] = useState("")
    const[password, setPassword]=useState("")
    const navigate = useNavigate()

    const handleLogin=async(e)=>{
       e.preventDefault()
       try{
        const data = await loginUser({
            email,
            password
        })
        localStorage.setItem("token",data.token)
        localStorage.setItem('role',data.role)

        if(data.role==='ADMIN')
          navigate('/admin')
        else
        navigate("/dashboard")
        
       }
       
       catch(error)
       {
          console.log(error);
          alert("Login Failed")
          
       }
    }
  return (
 <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Finova</div>
        <h1 className="auth-title">Welcome back</h1>
 
        <form className="auth-form" onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
 
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
 
            <button type="submit" className="btn-primary auth-submit">
                Login
            </button>
        </form>
 
        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
    )
    
}

export default Login

