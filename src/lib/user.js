import axios from 'axios';
import Cookies from 'js-cookie';

import { axiosApi } from './axios';

export const signUp = async (user) => {
  try {
    const records = await axiosApi.post(`/auth/signup`, user);
    Cookies.set('token', records.data.token);
    return 200;
  } catch (error) {
    return error.response.data;
  }
};

export const signIn = async (user) => {
  try {
    const records = await axios.post(`http://127.0.0.1:5005/api/auth/signin`, user);
    Cookies.set('token', records.data.token);
    return 200;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserData = async () => {
  try {
    const records = await axiosApi.get(`/auth/getuserdata`);
    Cookies.set('token', records.data.token);
    return 200;
  } catch (error) {
    return error.response.data;
  }
};
