import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaCloudUploadAlt, FaUtensils, FaRupeeSign, FaList, FaSortNumericUp, FaLeaf } from 'react-icons/fa';
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const CreateEditItem = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myshopData } = useSelector((state) => state.owner);
    const { itemId } = useParams(); // If editing
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [foodType, setFoodType] = useState('Veg');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Categories
    const categories = ['Food', 'Beverage', 'Dessert', 'Snack'];

    useEffect(() => {
        if (itemId) {
            // Fetch Item details if editing
            const fetchItem = async () => {
                try {
                    // Ideally we should have an endpoint to get single item, or find it from redux if we have it.
                    // For now, let's assume we might need to fetch it.
                    // Since I don't have a 'get single item' endpoint ready in my memory, 
                    // I'll check my shop data in Redux which has items.
                } catch (error) {
                    console.error(error);
                }
            }
            fetchItem();
        }
    }, [itemId]);

    useEffect(() => {
        if (itemId && myshopData?.shop?.items) {
            const item = myshopData.shop.items.find(i => i._id === itemId);
            if (item) {
                setName(item.name);
                setCategory(item.category);
                setPrice(item.price);
                setDescription(item.description);
                setStock(item.stock);
                setFoodType(item.foodType);
                setPreviewImage(item.image);
            }
        }
    }, [itemId, myshopData]);


    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('stock', stock);
        formData.append('foodType', foodType);
        if (image) formData.append('image', image);

        try {
            let response;
            if (itemId) {
                // Edit Mode
                response = await axios.put(`${serverUrl}/api/item/edit-item/${itemId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
            } else {
                // Add Mode
                response = await axios.post(`${serverUrl}/api/item/add-item`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
            }

            // Immediately update Redux state to reflect changes without refresh
            if (myshopData?.shop) {
                const newItem = response.data.item;
                const currentItems = myshopData.shop.items || [];
                let newItems;

                if (itemId) {
                    newItems = currentItems.map(i => i._id === newItem._id ? newItem : i);
                } else {
                    newItems = [...currentItems, newItem];
                }

                dispatch(setMyShopData({
                    ...myshopData,
                    shop: {
                        ...myshopData.shop,
                        items: newItems
                    }
                }));
            }

            setLoading(false);
            navigate('/create-edit-shop'); // Go back to dashboard on success
        } catch (error) {
            console.error("Error saving item", error);
            setLoading(false);
            alert("Failed to save item.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#fff9f6] flex justify-center items-center relative">
            <div className="absolute top-28 left-6 md:left-10 cursor-pointer hover:scale-110 transition-transform z-10" onClick={() => navigate('/create-edit-shop')}>
                <IoIosArrowRoundBack size={45} className="text-[#ff4d2d]" />
            </div>

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-orange-100 animate-in zoom-in-95 duration-500">
                <div className="bg-[#ff4d2d] py-6 px-8 text-white text-center">
                    <h2 className="text-3xl font-bold">{itemId ? 'Update Recipe' : 'Add New Delicacy'}</h2>
                    <p className="text-white/80 mt-1">Fill in the details to list your food item</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Image Upload */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-40 h-40 rounded-full border-4 border-[#fff9f6] shadow-lg overflow-hidden bg-gray-50 group cursor-pointer hover:border-[#ff4d2d] transition-colors">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-[#ff4d2d] transition-colors">
                                    <FaCloudUploadAlt className="text-4xl mb-2" />
                                    <span className="text-xs font-bold">Upload Image</span>
                                </div>
                            )}
                            <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" required={!itemId} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaUtensils className="text-[#ff4d2d]" /> Item Name
                            </label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] outline-none transition-all" placeholder="e.g. Spicy Burger" required />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaList className="text-[#ff4d2d]" /> Category
                            </label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] outline-none transition-all" required>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaRupeeSign className="text-[#ff4d2d]" /> Price
                            </label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] outline-none transition-all" placeholder="0.00" required />
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaSortNumericUp className="text-[#ff4d2d]" /> Stock Quantity
                            </label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] outline-none transition-all" placeholder="Available Quantity" required />
                        </div>

                        {/* Food Type */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                                <FaLeaf className="text-[#ff4d2d]" /> Food Type
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-all flex-1 justify-center">
                                    <input type="radio" name="foodType" value="Veg" checked={foodType?.toLowerCase() === 'veg'} onChange={() => setFoodType('Veg')} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                                    <span className="font-semibold text-gray-700">Veg</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 transition-all flex-1 justify-center">
                                    <input type="radio" name="foodType" value="Non-Veg" checked={foodType?.toLowerCase() === 'non-veg'} onChange={() => setFoodType('Non-Veg')} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="font-semibold text-gray-700">Non-Veg</span>
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                Description
                            </label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] outline-none transition-all min-h-[100px]" placeholder="Describe your delicious item..." required></textarea>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full mt-8 bg-[#ff4d2d] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#e04328] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 flex justify-center items-center gap-2">
                        {loading ? <ClipLoader size={24} color="#ffffff" /> : (itemId ? "Update Item" : "Add Item to Menu")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEditItem;
