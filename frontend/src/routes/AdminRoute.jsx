import React from 'react'
import { Navigate } from 'react-router-dom'
import { checkIsAdmin } from '../services/userService'
import { useEffect,useState } from 'react'

const AdminRoute = ({ children }) => {
    const token        = localStorage.getItem('token')
    const cachedRole   = localStorage.getItem('role')
 

    const [verified, setVerified] = useState(cachedRole === 'ADMIN')
    const [checking, setChecking] = useState(true)
 
    useEffect(() => {
        if (!token) {
            setChecking(false)
            return
        }
 
        let cancelled = false
 
        checkIsAdmin()
            .then((isAdmin) => {
                if (cancelled) return
                if (isAdmin) {
                    localStorage.setItem('role', 'ADMIN')   // keep cache in sync
                    setVerified(true)
                } else {
                    localStorage.removeItem('role')          // revoked — clear cache
                    setVerified(false)
                }
            })
            .catch(() => {
                if (!cancelled) setVerified(false)
            })
            .finally(() => {
                if (!cancelled) setChecking(false)
            })
 
        return () => { cancelled = true }
    }, [token])
 
    if (!token) return <Navigate to="/" replace />
 
    if (cachedRole !== 'ADMIN') return <Navigate to="/dashboard" replace />
 
  
    if (checking) return children
 
    if (!verified) return <Navigate to="/dashboard" replace />
 
    return children
}
 
export default AdminRoute