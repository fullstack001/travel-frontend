import axios from 'axios';
// import dotenv from 'dotenv';
import Cookies from 'js-cookie';

import { axiosApi } from './axios';

// dotenv.config();

const requestAddress = import.meta.env.VITE_API_URL_ADDRESS;

export const signUp = async (user) => {
  try {
    const response = await axiosApi.post('/auth/signup', user);
    Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    return 200;
  } catch (error) {
    console.error('Sign Up Error:', error.response?.data || error.message);
    return error.response?.data || { error: 'An error occurred during sign up' };
  }
};

export const signIn = async (user) => {
  try {
    const response = await axios.post(`${requestAddress}/api/auth/signin`, user);
    Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    return 200;
  } catch (error) {
    console.error('Sign In Error:', error.response?.data || error.message);
    return error.response?.data || { error: 'An error occurred during sign in' };
  }
};

export const getUserData = async () => {
  try {
    const response = await axiosApi.get('/auth/getuserdata');
    Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    return response.data; // Return user data instead of just a status code
  } catch (error) {
    console.error('Get User Data Error:', error.response?.data || error.message);
    return error.response?.data || { error: 'An error occurred while fetching user data' };
  }
};
