import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = import.meta.env.VITE_API_URL_ADDRESS;

export const getGuidData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/guid/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putGuidData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/guid/putguiddata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/guid/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
