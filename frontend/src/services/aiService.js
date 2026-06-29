import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

export const getAiInsight = async () => {
    const response = await axios.get(
        `${BASE_URL}/ai/insights`,
        authHeaders()
    )
    return response.data
}

export const askAiAssistant = async (question, history) => {
    const response = await axios.post(
        `${BASE_URL}/ai/ask`,
        { question, history },
        authHeaders()
    )
    return response.data
}

export const getSpendingSummary = async () => {
    const response = await axios.get(
        `${BASE_URL}/ai/spending-summary`,
        authHeaders()
    )
    return response.data
}