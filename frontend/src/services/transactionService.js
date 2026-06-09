import axios from "axios"

const BASE_URL =
    "http://localhost:8080/transactions"

export const depositMoney = async (
    accountNumber,
    amount
) => {

    const token =
        localStorage.getItem("token")

    const response = await axios.post(

        BASE_URL + "/deposit",

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

        BASE_URL + "/withdraw",

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
        BASE_URL + "/transfer",
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

        BASE_URL +
        `/${accountNumber}/recent`,

        {
            headers: {
                Authorization:
                  `Bearer ${token}`
            }
        }
    )

    return response.data
}