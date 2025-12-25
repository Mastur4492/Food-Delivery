import React, { useState } from 'react'
import { FaLocationDot, FaCartShopping, FaPlus, FaBagShopping, FaStore, FaUtensils } from 'react-icons/fa6';
import { FaSearch, FaUserCircle, FaCaretDown } from 'react-icons/fa';

// ... (existing code)


import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';

const Nav = () => {
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const { currentCity } = useSelector((state) => state.user);
    const { myshopData } = useSelector((state) => state.owner);

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/signout`, {}, { withCredentials: true });
            dispatch(setUserData(null));
            navigate('/signIn');
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    return (
        <div className='w-full h-[80px] flex items-center justify-between px-6 lg:px-12 fixed top-0 z-[999] bg-[#fff9f6] shadow-sm'>
            {/* Logo */}
            {/* Logo */}
            {/* Logo */}
            <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
                <FaUtensils className='text-3xl text-[#ff4d2d]' />
                <div className='flex flex-col justify-center'>
                    {userData?.user?.role === 'owner' &&
                        <span className='text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none ml-1'>Business</span>
                    }
                    {userData?.user?.role === 'deliveryBoy' &&
                        <span className='text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none ml-1'>Delivery Partner</span>
                    }
                    <h1 className='text-3xl font-bold text-[#ff4d2d] tracking-tight leading-none'>Zestify</h1>
                </div>
            </div>

            {/* Search Bar - Hidden on mobile, visible on tablet+ */}
            {userData?.user?.role === 'user' &&
                <div className='hidden md:flex items-center bg-white shadow-md rounded-full px-4 h-[50px] w-[50%] lg:w-[40%] border border-gray-100 transition-all hover:shadow-lg focus-within:shadow-lg focus-within:border-[#ff4d2d]'>
                    <div className='flex items-center gap-2 border-r border-gray-200 pr-4 mr-4 text-gray-500 cursor-pointer hover:text-[#ff4d2d] transition-colors'>
                        <FaLocationDot className='text-[#ff4d2d]' />
                        <span className='font-medium text-sm truncate max-w-[100px]'>{currentCity}</span>
                        <FaCaretDown className='text-xs' />
                    </div>
                    <div className='flex-1 flex items-center'>
                        <FaSearch className='text-gray-400 mr-3' />
                        <input
                            type="text"
                            placeholder="Search for restaurants, items..."
                            className='w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium'
                        />
                    </div>
                </div>
            }

            {/* Mobile Search Popup */}
            {showSearchPopup && (
                <div className='fixed inset-0 bg-black/50 z-[1000] flex justify-center items-start pt-24 px-4' onClick={() => setShowSearchPopup(false)}>
                    <div className='w-full max-w-md bg-white rounded-xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center gap-2 text-gray-600 mb-1 px-1'>
                            <FaLocationDot className='text-[#ff4d2d]' />
                            <span className='font-medium text-sm'>{currentCity}</span>
                        </div>
                        <div className='flex gap-3 items-center w-full'>
                            <div className='flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2'>
                                <FaSearch className='text-gray-400 mr-2' />
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className='w-full bg-transparent outline-none text-gray-700 font-medium'
                                    autoFocus
                                />
                            </div>
                            <button className='p-2 text-gray-500 hover:text-red-500' onClick={() => setShowSearchPopup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Actions */}
            <div className='flex items-center gap-6'>
                {/* Search Icon - Visible on Mobile Only */}
                {userData?.user?.role === 'user' &&
                    <div
                        className='md:hidden cursor-pointer hover:text-[#ff4d2d] transition-colors'
                        onClick={() => setShowSearchPopup(true)}
                    >
                        <FaSearch className='text-xl text-gray-600' />
                    </div>
                }

                {/* Cart Icon */}
                {userData?.user?.role === 'user' &&
                    <div className='relative cursor-pointer group'>
                        <FaCartShopping className='text-2xl text-gray-600 group-hover:text-[#ff4d2d] transition-colors' />
                        <span className='absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#fff9f6]'>
                            0
                        </span>
                    </div>
                }

                {/* Owner Orders Icon */}
                {userData?.user?.role === 'owner' && myshopData?.shop &&
                    <div className='relative cursor-pointer group mr-2' onClick={() => navigate('/owner/orders')}>
                        <FaBagShopping className='text-2xl text-gray-600 group-hover:text-[#ff4d2d] transition-colors' />
                        <span className='absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#fff9f6]'>
                            0
                        </span>
                    </div>
                }

                {/* Add Food Item Button - Visible only for Owner with a Shop */}
                {userData?.user?.role === 'owner' && myshopData?.shop &&
                    <button
                        className='flex items-center gap-2 bg-[#fff9f6]/10 text-[#ff4d2d] p-3 md:px-4 md:py-2 rounded-full shadow-md hover:bg-orange-50 transition-all transform hover:scale-105 active:scale-95'
                        onClick={() => navigate('/add-item')}
                    >
                        <FaPlus className='text-lg md:text-sm' />
                        <span className='hidden md:block text-sm font-semibold'>Add Item</span>
                    </button>
                }

                {/* Register Shop Button - Visible only for Owner WITHOUT a Shop */}
                {userData?.user?.role === 'owner' && !myshopData?.shop &&
                    <button
                        className='flex items-center gap-2 bg-[#ff4d2d] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#e04328] transition-all transform hover:scale-105 active:scale-95'
                        onClick={() => navigate('/create-shop')}
                    >
                        <FaStore className='text-sm' />
                        <span className='text-sm font-semibold'>Register Shop</span>
                    </button>
                }

                {/* User Profile */}
                <div className='relative'>
                    <div
                        className='flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-white hover:shadow-md transition-all'
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 text-[#ff4d2d]'>
                            {userData?.user?.profilePic ? (
                                <img src={userData.user.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <FaUserCircle className='text-2xl' />
                            )}
                        </div>
                        <span className='hidden lg:block font-semibold text-gray-700'>{userData?.user?.fullname?.split(' ')[0]}</span>
                        <FaCaretDown className={`text-gray-500 text-xs transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div className='absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200'>
                            <div className='px-4 py-3 border-b border-gray-100'>
                                <p className='text-sm font-bold text-gray-800'>{userData?.user?.fullname}</p>
                                <p className='text-xs text-gray-500 truncate'>{userData?.user?.email}</p>
                            </div>
                            <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff4d2d] transition-colors'>
                                Profile
                            </button>
                            <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff4d2d] transition-colors'>
                                Orders
                            </button>
                            <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff4d2d] transition-colors'>
                                Settings
                            </button>
                            <div className='h-px bg-gray-100 my-1'></div>
                            <button
                                onClick={handleLogout}
                                className='w-full text-left px-4 py-2 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nav