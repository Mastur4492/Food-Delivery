import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { FaStore, FaImage, FaMapMarkerAlt, FaCity, FaFlag, FaPen, FaTrash, FaUtensils } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const dispatch = useDispatch();
    const { myshopData } = useSelector((state) => state.owner);
    const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [name, setName] = useState(myshopData?.shop?.name || '');
    const [address, setAddress] = useState(myshopData?.shop?.address || currentAddress || '');
    const [city, setCity] = useState(myshopData?.shop?.city || currentCity || '');
    const [state, setState] = useState(myshopData?.shop?.state || currentState || '');
    const [backendImage, setBackendImage] = useState(null);
    const [frontendImage, setFrontendImage] = useState(myshopData?.shop?.image || null);

    // Toggle between View and Edit modes
    const [isEditing, setIsEditing] = useState(!myshopData?.shop);

    useEffect(() => {
        if (myshopData?.shop) {
            setIsEditing(false); // Ensure we show dashboard when data loads

            setName(myshopData.shop.name || name);
            setAddress(myshopData.shop.address || address);
            setCity(myshopData.shop.city || city);
            setState(myshopData.shop.state || state);
            if (myshopData.shop.image) {
                setFrontendImage(myshopData.shop.image);
            }
        } else {
            // Auto-fill for new shop
            setIsEditing(true); // If no shop, ensure we are in edit/create mode
            if (!address && currentAddress) setAddress(currentAddress);
            if (!city && currentCity) setCity(currentCity);
            if (!state && currentState) setState(currentState);
        }
    }, [myshopData, currentCity, currentState, currentAddress]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        if (file) {
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`${serverUrl}/api/item/delete-item/${itemId}`, { withCredentials: true });
            const updatedItems = myshopData.shop.items.filter(item => item._id !== itemId);
            dispatch(setMyShopData({
                ...myshopData,
                shop: { ...myshopData.shop, items: updatedItems }
            }));
        } catch (error) {
            console.error("Error deleting item", error);
            alert("Failed to delete item");
        }
    };

    const handleDeleteShop = async () => {
        if (!window.confirm("Are you sure you want to delete your entire shop? This cannot be undone.")) return;
        try {
            await axios.delete(`${serverUrl}/api/shop/delete-shop`, { withCredentials: true });
            dispatch(setMyShopData(null));
            setFrontendImage(null);
            setName('');
            setAddress(currentAddress || '');
            setCity(currentCity || '');
            setState(currentState || '');
            setIsEditing(true);
        } catch (error) {
            console.error("Error deleting shop", error);
            alert("Failed to delete shop");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // ... (rest of handleSubmit logic) ...
        const data = new FormData();
        data.append('name', name);
        data.append('address', address);
        data.append('city', city);
        data.append('state', state);
        if (backendImage) {
            data.append('image', backendImage);
        }

        try {
            const response = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            dispatch(setMyShopData({ shop: response.data.shop }));
            setLoading(false);
            setShowSuccessPopup(true);
            setIsEditing(false); // Switch to View mode on success

        } catch (error) {
            console.error("Error creating shop", error);
            setLoading(false);
            alert("Failed to create shop. Please try again.");
        }
    };


    if (showSuccessPopup) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[2000] animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center scale-in-95 animate-in zoom-in-95 duration-300">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaStore className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Registered!</h2>
                    <p className="text-gray-600 mb-6">Your shop is now live. You can start adding delicious food items to your menu.</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/add-item')}
                            className="w-full py-3 bg-[#ff4d2d] text-white rounded-xl font-semibold hover:bg-[#e04328] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Add Food Item Now
                        </button>
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View Mode (Dashboard)
    if (!isEditing && myshopData?.shop) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-[#fff9f6] flex flex-col items-center relative">
                {!isHome && (
                    <div className="absolute top-28 left-6 md:left-10 cursor-pointer hover:scale-110 transition-transform z-10" onClick={() => navigate('/')}>
                        <IoIosArrowRoundBack size={45} className="text-[#ff4d2d]" />
                    </div>
                )}

                <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <FaUtensils className="text-3xl text-[#ff4d2d]" />
                        <h1 className="text-3xl font-bold text-gray-800">Welcome to {myshopData.shop.name}</h1>
                    </div>

                    {/* Shop Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100 group relative">
                        <div className="h-64 md:h-80 w-full relative">
                            <img src={myshopData.shop.image} alt={myshopData.shop.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-[#ff4d2d] p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg z-10" onClick={() => setIsEditing(true)}>
                                <FaPen className="text-white text-lg" />
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-1">{myshopData.shop.name}</h2>
                            <p className="text-gray-500 font-medium text-lg mb-2">{myshopData.shop.city}, {myshopData.shop.state}</p>
                            <p className="text-gray-400 text-sm border-t border-gray-100 pt-3 mt-2">{myshopData.shop.address}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="grid gap-6">
                        {myshopData.shop.items && myshopData.shop.items.length > 0 ? (
                            myshopData.shop.items.map((item) => (
                                <div key={item._id} className="bg-white rounded-2xl p-4 shadow-md flex gap-4 md:gap-6 items-center border border-gray-100 hover:shadow-lg transition-shadow">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#ff4d2d] mb-1">{item.name}</h3>
                                        <p className="text-gray-600 font-medium text-sm">Category: <span className="text-gray-800">{item.category}</span></p>
                                        <p className="text-gray-600 font-medium text-sm">Food Type: <span className={`${item.foodType === 'Veg' || item.foodType === 'veg' ? "text-green-600" : "text-red-500"} font-bold`}>{item.foodType}</span></p>
                                        <p className="text-xl font-bold text-gray-800 mt-2">₹{item.price}</p>
                                    </div>
                                    <div className="flex flex-col gap-3 self-center pr-2">
                                        <button onClick={() => navigate(`/edit-item/${item._id}`)} className="text-gray-400 hover:text-[#ff4d2d] transition-colors"><FaPen size={18} /></button>
                                        <button onClick={() => handleDeleteItem(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={18} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4">No food items added yet.</p>
                                <button onClick={() => navigate('/add-item')} className="px-6 py-2 bg-[#ff4d2d] text-white rounded-full font-semibold hover:bg-[#e04328] transition-colors">
                                    Add First Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#fff9f6] flex justify-center items-center relative">
            {!isHome && (
                <div className="absolute top-28 left-6 md:left-10 cursor-pointer hover:scale-110 transition-transform z-10" onClick={() => navigate('/')}>
                    <IoIosArrowRoundBack size={45} className="text-[#ff4d2d]" />
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-orange-100 animate-in slide-in-from-right-8 duration-500">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">{myshopData?.shop ? "Update Your Business" : "Register Your Business"}</h2>
                    <p className="text-gray-500 mt-2">{myshopData?.shop ? "Manage your shop details below" : "Start your journey with Flavr Partner"}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Image Upload */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#ff4d2d] transition-colors cursor-pointer">
                            {frontendImage ? (
                                <img src={frontendImage} alt="Shop Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <FaImage className="text-4xl text-gray-300 mb-3 group-hover:text-[#ff4d2d] transition-colors" />
                                    <span className="text-sm text-gray-400 font-medium group-hover:text-[#ff4d2d]">Upload Shop Logo/Image</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required={!myshopData?.shop} // Only required for new shop
                            />
                        </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="flex flex-col gap-5">
                        <div className="relative">
                            <FaStore className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Shop Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="address"
                                placeholder="Full Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FaCity className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <FaFlag className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[#ff4d2d] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#e04328] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <ClipLoader size={24} color="#ffffff" /> : (myshopData?.shop ? 'Update Shop' : 'Register Shop')}
                        </button>
                        {/* Cancel & Delete Buttons */}
                        {myshopData?.shop && (
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteShop}
                                    className="flex-1 bg-red-50 text-red-500 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaTrash /> Delete Shop
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEditShop;