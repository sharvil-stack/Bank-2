import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import '../../styles/Admin.css'

const AdminLayout = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem('role')
        navigate("/")
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    Finova
                    <span>Admin Portal</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end>Dashboard</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>
                    <NavLink to="/admin/accounts">Accounts</NavLink>
                    <NavLink to="/admin/transactions">Transactions</NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                        Back to App
                    </button>
                    <button className="btn-danger" style={{ marginTop: 8 }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    )
}
export default AdminLayout;