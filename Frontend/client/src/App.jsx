import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import AttemptTest from './Pages/Attempttest'
import Results from './Pages/Result'
import ProtectedRoute from './components/ProtectionRoute'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/attempt" element={
        <ProtectedRoute>
          <AttemptTest />
        </ProtectedRoute>
      } />
      <Route path="/results" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      <Route path="/practice" element={
        <ProtectedRoute>
          <AttemptTest />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
