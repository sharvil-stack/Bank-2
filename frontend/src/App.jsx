import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Register from './pages/Register'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAccounts from './pages/admin/AdminAccounts'
import AdminTransactions from './pages/admin/AdminTransactions'
function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/"
              element={<Login/>}
         />
         <Route path='/dashboard'
                element={
                  <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute>
              }
          />
          <Route path='/register' element={<Register/>}
          />

            <Route path='/admin' element={
            <AdminRoute>
              <AdminLayout/>
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard/>} />
            <Route path='users' element={<AdminUsers/>} />
            <Route path='accounts' element={<AdminAccounts/>} />
            <Route path='transactions' element={<AdminTransactions/>} />
          </Route>
      </Routes>

  </BrowserRouter>
  )
}

export default App