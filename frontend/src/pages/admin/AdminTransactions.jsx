import React, { useEffect, useState } from 'react'
import { getAllAccounts } from '../../services/accountService'
import { getAllTransactionsByAccount } from '../../services/transactionService'

const TYPE_COLORS = {
    DEPOSIT:  { color: 'var(--accent)', bg: 'var(--accent-bg)' },
    WITHDRAW: { color: 'var(--danger)', bg: 'var(--danger-bg)' },
    TRANSFER: { color: 'var(--info)',   bg: 'rgba(91,141,239,0.1)' },
}

const TxBadge = ({ type }) => {
    const style = TYPE_COLORS[type?.toUpperCase()] || {}
    return (
        <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 999,
            fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
            color: style.color, background: style.bg,
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
            `${t.type} ${t.description} ${t.amount}`.toLowerCase().includes(search.toLowerCase())
        )

    const totalIn  = transactions.filter(t => t.type?.toUpperCase() === "DEPOSIT").reduce((s, t) => s + Number(t.amount), 0)
    const totalOut = transactions.filter(t => ["WITHDRAW", "TRANSFER"].includes(t.type?.toUpperCase())).reduce((s, t) => s + Number(t.amount), 0)

    return (
        <div>
            <div className="admin-page-header">
                <h1>Transactions</h1>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <select value={selectedAccount} onChange={e => { setSelectedAccount(e.target.value); setFetched(false) }} style={{ minWidth: 260 }}>
                    <option value="">Select an account...</option>
                    {accounts.map(a => (
                        <option key={a.accountNumber} value={a.accountNumber}>
                            {a.accountNumber} — ₹{Number(a.balance).toLocaleString('en-IN')} ({a.status})
                        </option>
                    ))}
                </select>
                <button className="btn-primary" disabled={!selectedAccount || loading} onClick={handleFetch}>
                    {loading ? "Loading..." : "Load Transactions"}
                </button>
            </div>

            {fetched && (
                <>
                    <div className="admin-stats-grid" style={{ marginBottom: 16 }}>
                        <div className="admin-stat-card">
                            <div className="admin-stat-label">Total Transactions</div>
                            <div className="admin-stat-value">{transactions.length}</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-label">Total Credited</div>
                            <div className="admin-stat-value positive">₹{totalIn.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-label">Total Debited</div>
                            <div className="admin-stat-value negative">₹{totalOut.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <input placeholder="Search type, description, amount..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 'auto' }}>
                            <option value="ALL">All Types</option>
                            <option value="DEPOSIT">Deposit</option>
                            <option value="WITHDRAW">Withdraw</option>
                            <option value="TRANSFER">Transfer</option>
                        </select>
                    </div>

                    <div className="admin-table-wrapper">
                        {filtered.length === 0
                            ? <div className="admin-empty">No transactions found.</div>
                            : (
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>ID</th><th>Type</th><th>Amount</th><th>Description</th><th>Date</th></tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(tx => (
                                            <tr key={tx.id}>
                                                <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 13 }}>#{tx.id}</td>
                                                <td><TxBadge type={tx.type} /></td>
                                                <td style={{ fontWeight: 600, color: tx.type?.toUpperCase() === 'DEPOSIT' ? 'var(--accent)' : 'var(--danger)' }}>
                                                    {tx.type?.toUpperCase() === 'DEPOSIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{tx.description || '—'}</td>
                                                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-IN') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </>
            )}

            {!fetched && !loading && (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                    Select an account above to view its transactions.
                </div>
            )}
        </div>
    )
}

export default AdminTransactions