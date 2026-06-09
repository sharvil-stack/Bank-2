import React, { useState } from 'react'
import { loginUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
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
   
        navigate("/dashboard")
        
       }
       
       catch(error)
       {
          console.log(error);
          alert("Login Failed")
          
       }
    }
  return (
   <div>

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
                <p>
                    Don't have an account?
                </p>
              <button
  onClick={() =>
    navigate("/register")
  }
>
  Register
</button>
            </form>

        </div>
    )
    
}

export default Login

