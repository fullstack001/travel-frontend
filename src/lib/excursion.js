import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = import.meta.env.VITE_API_URL_ADDRESS;

export const getExcursionData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/excursion/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putExcursionData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/excursion/put-excursion-data`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteExcursionData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/excursion/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
