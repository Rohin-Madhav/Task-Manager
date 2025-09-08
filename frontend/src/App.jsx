import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegistrationForm from './pages/Register'
import LoginForm from './pages/Login'
import Layout from '../Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
        <Route index element={<Home/>}/>
        </Route>
        <Route path='/register' element={<RegistrationForm/>}/>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>

      
    </>
  )
}

export default App
