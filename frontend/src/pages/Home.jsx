import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import CreateEditShop from './CreateEditShop'
import DeliveryDashboard from '../components/DeliveryBoyDashBoard'

const Home = () => {
  const { userData } = useSelector((state) => state.user)
  return (
    <div className='w-full min-h-screen bg-[#fff9f6]'>
      {userData?.user?.role === "user" && <div className="pt-[100px] flex flex-col items-center"><UserDashboard /></div>}
      {userData?.user?.role === "owner" && <CreateEditShop />}
      {userData?.user?.role === "deliveryBoy" && <div className="pt-[100px] flex flex-col items-center"><DeliveryDashboard /></div>}
    </div>
  )
}

export default Home