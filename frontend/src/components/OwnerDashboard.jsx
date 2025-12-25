import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { myshopData } = useSelector((state) => state.owner || {});

  // This useEffect was previously used to redirect if a shop existed.
  // However, the logic for displaying the shop or the creation form
  // is now handled directly by the CreateEditShop component, which is
  // rendered in Home.jsx for owners.
  // This OwnerDashboard component is now primarily for the case where
  // an owner has no shop and needs to create one.
  // Therefore, the redirect logic here is no longer necessary and can be removed.
  // If myshopData exists, the Home component will render CreateEditShop,
  // which will then display the shop dashboard.
  // If myshopData does not exist, this component correctly prompts the user to create one.
  // useEffect(() => {
  //   if (myshopData?.shop) {
  //     navigate('/create-edit-shop');
  //   }
  // }, [myshopData, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#fff9f6] flex justify-center items-center w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 animate-in zoom-in-95 duration-500">
        <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <FaUtensils className="text-6xl text-[#ff4d2d]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Your Restaurant</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Join our food delivery platform and reach thousands of hungry customers every day.
        </p>
        <button
          onClick={() => navigate('/create-edit-shop')}
          className="w-full py-3.5 bg-[#ff4d2d] text-white rounded-xl font-bold text-lg hover:bg-[#e04328] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  )
};

export default OwnerDashboard;