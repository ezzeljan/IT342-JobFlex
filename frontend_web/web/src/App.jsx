import './App.css'
import { Routes, Route } from "react-router-dom"
import Register from './components/login-register/register'
import Login from './components/login-register/Login'


function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
