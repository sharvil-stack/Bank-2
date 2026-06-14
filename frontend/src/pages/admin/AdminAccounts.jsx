import React, { useEffect, useState } from 'react'
import { getAllAccounts, activateAccount, closeAccount } from '../../services/accountService'

const StatusBadge = ({ status }) => {
    const cls = status?.toLowerCase()
    return <span className={`admin-badge ${cls}`}>{status}</span>
}

const AdminAccounts = () => {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const fetchAccounts = async () => {
        try {
            setLoading(true)
            const data = await getAllAccounts()
            setAccounts(data)
        } catch (err) {
            console.error(err)
            alert("Failed to fetch accounts")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAccounts() }, [])

    const handleActivate = async (accountNumber) => {
        try {
            setActionLoading(accountNumber + "_activate")
            await activateAccount(accountNumber)
            fetchAccounts()
        } catch (err) {
            alert(err.response?.data?.message || "Failed to activate account")
        } finally {
            setActionLoading(null)
        }
    }

    const handleClose = async (accountNumber) => {
        if (!window.confirm(`Close account ${accountNumber}? This cannot be undone.`)) return
        try {
            setActionLoading(accountNumber + "_close")
            await closeAccount(accountNumber)
            fetchAccounts()
        } catch (err) {
            alert(err.response?.data?.message || "Failed to close account")
        } finally {
            setActionLoading(null)
        }
    }

    const filtered = accounts
        .filter(a => statusFilter === "ALL" || a.status === statusFilter)
        .filter(a =>
            `${a.accountNumber} ${a.status}`.toLowerCase().includes(search.toLowerCase())
        )

    const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0)

    return (
        <div>
            <div className="admin-page-header">
                <h1>Accounts</h1>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    {accounts.length} total &nbsp;·&nbsp;
                    Total balance: <strong style={{ color: 'var(--accent)' }}>
                        ₹{totalBalance.toLocaleString('en-IN')}
                    </strong>
                </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <input
                    placeholder="Search account number or status..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 300 }}
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            <div className="admin-table-wrapper">
                {loading && <div className="admin-loading">Loading accounts...</div>}

                {!loading && filtered.length === 0 && (
                    <div className="admin-empty">No accounts found.</div>
                )}

                {!loading && filtered.length > 0 && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Account Number</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(account => (
                                <tr key={account.accountNumber}>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{account.accountNumber}</td>
                                    <td style={{ color: 'var(--text-h)', fontWeight: 600 }}>
                                        ₹{Number(account.balance).toLocaleString('en-IN')}
                                    </td>
                                    <td><StatusBadge status={account.status} /></td>
                                    <td>
                                        <div className="admin-table-actions">
                                            {account.status !== 'ACTIVE' && (
                                                <button className="btn-primary" disabled={actionLoading === account.accountNumber + "_activate"} onClick={() => handleActivate(account.accountNumber)}>
                                                    {actionLoading === account.accountNumber + "_activate" ? "Activating..." : "Activate"}
                                                </button>
                                            )}
                                            {account.status !== 'CLOSED' && (
                                                <button className="btn-danger" disabled={actionLoading === account.accountNumber + "_close"} onClick={() => handleClose(account.accountNumber)}>
                                                    {actionLoading === account.accountNumber + "_close" ? "Closing..." : "Close"}
                                                </button>
                                            )}
                                            {account.status === 'CLOSED' && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No actions</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default AdminAccounts