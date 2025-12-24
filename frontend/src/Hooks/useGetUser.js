import { useEffect } from 'react';
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const useGetUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/current-user`,
          { withCredentials: true }
        );

        dispatch(setUserData(response.data));
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);
};

export default useGetUser;
