import React, { useState, useEffect } from 'react'
import { getAllUsers, deleteUser, updateUser } from '../../services/userService'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
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
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    {users.length} total
                </span>
            </div>

            <input
                placeholder="Search by name, email or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 320, marginBottom: 16 }}
            />

            <div className="admin-table-wrapper">
                {loading && <div className="admin-loading">Loading users...</div>}

                {!loading && filtered.length === 0 && (
                    <div className="admin-empty">No users found.</div>
                )}

                {!loading && filtered.length > 0 && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    {editingUser === user.id ? (
                                        <>
                                            <td>{user.id}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <input value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First name" style={{ width: 100 }} />
                                                    <input value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last name" style={{ width: 100 }} />
                                                </div>
                                            </td>
                                            <td>
                                                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
                                            </td>
                                            <td>
                                                <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={{ width: 'auto' }}>
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button className="btn-primary" disabled={saving} onClick={() => handleEditSave(user.id)}>
                                                        {saving ? "Saving..." : "Save"}
                                                    </button>
                                                    <button className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 13 }}>#{user.id}</td>
                                            <td style={{ color: 'var(--text-h)', fontWeight: 600 }}>{user.firstName} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td><span className={`admin-badge role-${user.role?.toLowerCase()}`}>{user.role}</span></td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button className="btn-secondary" onClick={() => handleEditOpen(user)}>Edit</button>
                                                    <button className="btn-danger" onClick={() => handleDelete(user.id, user.email)}>Delete</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default AdminUsers