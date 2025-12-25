import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import useGetUser from './Hooks/useGetUser'
import { useSelector } from 'react-redux'
import Nav from './components/Nav'
import useGetCity from './Hooks/useGetCity'
import useGetMyShop from './Hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import OwnerDashboard from './components/OwnerDashboard'
import CreateEditItem from './pages/CreateEditItem'
export const serverUrl = 'http://localhost:5000';
const App = () => {
  useGetUser();
  useGetCity();
  useGetMyShop();
  const userData = useSelector((state) => state.user.userData);
  const myshopData = useSelector((state) => state.owner.myshopData);

  return (
    <>
      {userData && <Nav />}
      <Routes>
        <Route path='/' element={userData ? <Home /> : <SignIn />} />
        <Route path='/signUp' element={!userData ? <SignUp /> : <Home />} />
        <Route path='/signIn' element={!userData ? <SignIn /> : <Home />} />
        <Route path='/create-shop' element={userData ? <OwnerDashboard /> : <SignIn />} />
        <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <SignIn />} />
        <Route path='/add-item' element={userData ? <CreateEditItem /> : <SignIn />} />
        <Route path='/edit-item/:itemId' element={userData ? <CreateEditItem /> : <SignIn />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Home />} />
      </Routes>
    </>
  )
}

export default App