import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import useGetUser from './Hooks/useGetUser'
export const serverUrl = 'http://localhost:5000';
const App = () => {
  useGetUser();
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App