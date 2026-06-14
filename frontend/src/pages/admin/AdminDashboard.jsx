import React from 'react'
import { useEffect, useState } from 'react'
import { getAllUsers } from '../../services/userService'
import { getAllAccounts } from '../../services/accountService'

const StatCard = ({ label, value, sub, accent }) => (
    <div className="admin-stat-card">
        <div className="admin-stat-label">{label}</div>
        <div className={`admin-stat-value ${accent || ''}`}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
    </div>
)

const AdminDashboard = () => {
    const[users, setUsers] = useState([])
    const[account,setAccounts]=useState([])
    const[loading,setLoading]=useState(true)
    const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [u, a] = await Promise.all([getAllUsers(), getAllAccounts()])
                setUsers(u)
                setAccounts(a)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

   
    const totalUsers    = users.length
    const adminCount    = users.filter(u => u.role === 'ADMIN').length
    const userCount     = users.filter(u => u.role === 'USER').length

    const totalAccounts = accounts.length
    const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length
    const closedAccounts = accounts.filter(a => a.status === 'CLOSED').length

    const totalBalance  = accounts.reduce((s, a) => s + Number(a.balance || 0), 0)
    const avgBalance    = totalAccounts > 0
        ? (totalBalance / totalAccounts).toFixed(2)
        : 0

    const topAccounts = [...accounts]
        .sort((a, b) => Number(b.balance) - Number(a.balance))
        .slice(0, 5)

    const recentUsers = [...users]
        .slice(-5)
        .reverse()

    if (loading) {
        return <div className="admin-loading">Loading dashboard...</div>
    }

   return (
        <div>
            <div className="admin-page-header" style={{ marginBottom: 24 }}>
                <h1>Dashboard</h1>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Overview across all users & accounts
                </span>
            </div>

           
            <h3 style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Users
            </h3>
            <div className="admin-stats-grid">
                <StatCard label="Total Users" value={totalUsers} />
                <StatCard label="Regular Users" value={userCount} />
                <StatCard label="Admins" value={adminCount} accent="positive" />
            </div>

            
            <h3 style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: '24px 0 12px' }}>
                Accounts
            </h3>
            <div className="admin-stats-grid">
                <StatCard label="Total Accounts" value={totalAccounts} />
                <StatCard label="Active" value={activeAccounts} accent="positive" />
                <StatCard label="Closed" value={closedAccounts} accent="negative" />
                <StatCard
                    label="Total Balance"
                    value={`₹${Number(totalBalance).toLocaleString('en-IN')}`}
                    accent="positive"
                />
                <StatCard
                    label="Avg Balance / Account"
                    value={`₹${Number(avgBalance).toLocaleString('en-IN')}`}
                />
            </div>

            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>

               
                <div>
                    <h3 style={{ marginBottom: 12, fontSize: 15 }}>Top Accounts by Balance</h3>
                    <div className="admin-table-wrapper">
                        {topAccounts.length === 0
                            ? <div className="admin-empty">No accounts.</div>
                            : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Account No.</th>
                                            <th>Balance</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topAccounts.map(a => (
                                            <tr key={a.accountNumber}>
                                                <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                                                    {a.accountNumber}
                                                </td>
                                                <td style={{ fontWeight: 600, color: 'var(--accent)' }}>
                                                    ₹{Number(a.balance).toLocaleString('en-IN')}
                                                </td>
                                                <td>
                                                    <span className={`admin-badge ${a.status?.toLowerCase()}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>

                
                <div>
                    <h3 style={{ marginBottom: 12, fontSize: 15 }}>Recently Added Users</h3>
                    <div className="admin-table-wrapper">
                        {recentUsers.length === 0
                            ? <div className="admin-empty">No users.</div>
                            : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map(u => (
                                            <tr key={u.id}>
                                                <td style={{ fontWeight: 600, color: 'var(--text-h)' }}>
                                                    {u.firstName} {u.lastName}
                                                </td>
                                                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                                    {u.email}
                                                </td>
                                                <td>
                                                    <span className={`admin-badge role-${u.role?.toLowerCase()}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
}

export default AdminDashboard