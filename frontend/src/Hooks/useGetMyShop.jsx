import { useEffect } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';

const useGetMyShop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/shop/get-my-shop`,
          { withCredentials: true }
        );

        dispatch(setMyShopData(response.data));
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching my shop:', error);
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          dispatch(setMyShopData(null));
        }
      }
    };

    fetchMyShop();
  }, [dispatch]);
};

export default useGetMyShop;
