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

export const putResaData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/putresadata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const getDailyData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/getdailydata`, {
      data,
    });
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putDailyData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/putdailydata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteDailyData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/resa/deletedailydata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
