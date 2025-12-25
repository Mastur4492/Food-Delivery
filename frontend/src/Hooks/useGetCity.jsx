import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentCity, setCurrentState, setCurrentAddress } from '../redux/userSlice.js';

const useGetCity = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const fetchCity = async () => {
                try {
                    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_API_KEY}`);
                    dispatch(setCurrentCity(result.data.results[0].city));
                    dispatch(setCurrentState(result.data.results[0].state));
                    dispatch(setCurrentAddress(result.data.results[0].formatted));
                } catch (error) {
                    console.error('Error fetching city:', error);
                }
            }
            fetchCity();
        }, (error) => {
            console.error("Error getting location", error);
        });
    }, []);
}

export default useGetCity;
