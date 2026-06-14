import React from 'react'
import {  Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
 import { ToastContainer, toast } from 'react-toastify'
import Registration from './pages/Registration';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/registration' element={<Registration/>} />
    <Route path='/login' element={<LoginPage/>} />
   </Routes>
<ToastContainer/>
    </>
  )
}

export default App