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

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

export const getAllAccounts = async () => {
    const response = await axios.get(
        `${BASE_URL}/accounts`,
        authHeaders()
    )
    return response.data
}

export const activateAccount = async (accountNumber) => {
    const response = await axios.put(
        `${BASE_URL}/accounts/${accountNumber}/activate`,
        {},
        authHeaders()
    )
    return response.data
}

export const closeAccount = async (accountNumber) => {
    const response = await axios.put(
        `${BASE_URL}/accounts/${accountNumber}/close`,
        {},
        authHeaders()
    )
    return response.data
}
