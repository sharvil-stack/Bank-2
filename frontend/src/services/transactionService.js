import axios from "axios"

const BASE_URL =
    import.meta.env.VITE_API_URL;

export const depositMoney = async (
    accountNumber,
    amount
) => {

    const token =
        localStorage.getItem("token")

    const response = await axios.post(

        `${BASE_URL}/transactions/deposit`,

        {
            accountNumber,
            amount
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}
export const withdrawMoney = async (
    accountNumber,
    amount
) => {

    const token =
        localStorage.getItem("token")

    const response = await axios.post(

        `${BASE_URL}/transactions/withdraw`,

        {
            accountNumber,
            amount
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return response.data
}

export const transferMoney = async (fromAccount, toAccount, amount) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${BASE_URL}/transactions/transfer`,
        {
            fromAccount,
            toAccount,
            amount
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return response.data
}
export const getRecentTransactions =
    async (accountNumber) => {

    const token =
        localStorage.getItem("token")

    const response = await axios.get(

       `${BASE_URL}/transactions/${accountNumber}/recent`,

        {
            headers: {
                Authorization:
                  `Bearer ${token}`
            }
        }
    )

    return response.data
}