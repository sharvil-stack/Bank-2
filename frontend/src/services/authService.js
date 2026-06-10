import axios from "axios";
const BASE_URL =
    import.meta.env.VITE_API_URL;

export const loginUser = async(loginData)=>{

     const response = await axios.post(
        `${BASE_URL}/auth/login`,
        loginData
    )
return response.data;
}
export const registerUser = async (
  firstName,
  lastName,
  email,
  password
) => {

  const response = await axios.post(
    `${BASE_URL}/auth/register`,

    {
      firstName,
      lastName,
      email,
      password
    }
  )

  return response.data
}