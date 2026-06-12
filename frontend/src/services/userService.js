import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

export const getAllUsers = async () => {
    const response = await axios.get(`${BASE_URL}/users`, authHeaders())
    return response.data
}

export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/users/${id}`, authHeaders())
    return response.data
}

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/users/${id}`, userData, authHeaders())
    return response.data
}

export const deleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`, authHeaders())
    return response.data
}


export const checkIsAdmin = async () => {
    try {
        await axios.get(`${BASE_URL}/users`, authHeaders())
        return true
    } catch (error) {
        if (error.response && [401, 403].includes(error.response.status)) {
            return false
        }
       
        throw error
    }
}