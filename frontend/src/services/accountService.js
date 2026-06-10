import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL

export const getAccounts = async () => {

    const token = localStorage.getItem("token")

    const response = await axios.get(
        `${BASE_URL}/accounts`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export const createAccount = async () => {

    const token = localStorage.getItem("token")

    const response = await axios.post(
        `${BASE_URL}/accounts/create`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}
