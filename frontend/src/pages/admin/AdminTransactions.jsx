import React from 'react'
import { getAllAccounts } from '../../services/accountService'
import { getAllTransactionsByAccount } from '../../services/transactionService'

const TYPE_COLORS = {
    DEPOSIT:  { color: 'var(--accent)',  bg: 'var(--accent-bg)' },
    WITHDRAW: { color: 'var(--danger)',  bg: 'var(--danger-bg)' },
    TRANSFER: { color: 'var(--info)',    bg: 'rgba(91,141,239,0.1)' },
}

const TxBadge = ({ type }) => {
    const style = TYPE_COLORS[type?.toUpperCase()] || {}
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: style.color,
            background: style.bg,
        }}>
            {type}
        </span>
    )
}

const AdminTransactions = () => {
    const [accounts, setAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState("")
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)
    const [typeFilter, setTypeFilter] = useState("ALL")
    const [search, setSearch] = useState("")

     useEffect(() => {
        getAllAccounts()
            .then(setAccounts)
            .catch(err => console.error(err))
    }, [])

    const handleFetch = async () => {
        if (!selectedAccount) return
        try {
            setLoading(true)
            setFetched(false)
            const data = await getAllTransactionsByAccount(selectedAccount)
            setTransactions(data)
            setFetched(true)
        } catch (err) {
            console.error(err)
            alert("Failed to fetch transactions")
        } finally {
            setLoading(false)
        }
    }

    const filtered = transactions
        .filter(t => typeFilter === "ALL" || t.type?.toUpperCase() === typeFilter)
        .filter(t =>
            `${t.type} ${t.description} ${t.amount}`
                .toLowerCase()
                .includes(search.toLowerCase())
        )

    const totalIn = transactions
        .filter(t => t.type?.toUpperCase() === "DEPOSIT")
        .reduce((s, t) => s + Number(t.amount), 0)

    const totalOut = transactions
        .filter(t => ["WITHDRAW", "TRANSFER"].includes(t.type?.toUpperCase()))
        .reduce((s, t) => s + Number(t.amount), 0)
    return (
        <div>
            <div className="admin-page-header">
                <h1>Transactions</h1>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Coming soon.</p>
        </div>
    )
}

export default AdminTransactions