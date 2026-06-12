import React from 'react'
import { Navigate } from 'react-router-dom'
import { checkIsAdmin } from '../services/userService'
import { useEffect,useState } from 'react'

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token")
    const [status, setStatus] = useState(token ? "checking" : "no-token")

    useEffect(() => {
        if (!token) return

        let cancelled = false

        checkIsAdmin()
            .then((isAdmin) => {
                if (!cancelled) setStatus(isAdmin ? "admin" : "forbidden")
            })
            .catch(() => {
                if (!cancelled) setStatus("forbidden")
            })

        return () => { cancelled = true }
    }, [token])

    if (!token) return <Navigate to="/" />
    if (status === "checking") return <div className="admin-route-loading">Checking access...</div>
    if (status === "forbidden") return <Navigate to="/dashboard" />

    return children
}

export default AdminRoute