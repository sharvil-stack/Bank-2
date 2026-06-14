import React, { useState } from 'react'
import { getAllUsers, deleteUser,updateUser } from '../../services/userService'
const AdminUsers = () => {
    const[users,setUsers]=useState([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

     const fetchUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(data)
        } catch (err) {
            console.error(err)
            alert("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])
    const handleEditOpen = (user) => {
        setEditingUser(user.id)
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        })
    }

    const handleEditSave = async (id) => {
        try {
            setSaving(true)
            await updateUser(id, editForm)
            setEditingUser(null)
            fetchUsers()
        } catch (err) {
            console.error(err)
            alert("Failed to update user")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, email) => {
        if (!window.confirm(`Delete user "${email}"? This cannot be undone.`)) return
        try {
            await deleteUser(id)
            fetchUsers()
        } catch (err) {
            console.error(err)
            alert("Failed to delete user")
        }
    }

    const filtered = users.filter(u =>
        `${u.firstName} ${u.lastName} ${u.email} ${u.role}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )


    return (
        <div>
            <div className="admin-page-header">
                <h1>Users</h1>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Coming soon.</p>
        </div>
    )
}

export default AdminUsers