import axios from "axios";
const BASE_URL  = "http://localhost:8080/auth"

export const loginUser = async(loginData)=>{

     const response = await axios.post(
        `${BASE_URL}/login`,
        loginData
    )
return response.data;
}