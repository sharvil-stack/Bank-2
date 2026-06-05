import axios from "axios"

const BASE_URL = "http://localhost:8080/accounts"

export const getAccounts = async () => {

    const token = localStorage.getItem("token")

    const response = await axios.get(
        BASE_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}