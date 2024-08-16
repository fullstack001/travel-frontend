import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = import.meta.env.VITE_API_URL_ADDRESS;

export const getResaData = async (params) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/getresadata`, params);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const getDailyData = async (date) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/getdailydata`, {
      date,
    });
    return records.data;
  } catch (error) {
    return 500;
  }
};
