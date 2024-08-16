import axios from 'axios';

export const getResaData = async () => {
  try {
    const records = await axios.get(`http://127.0.0.1:5005/api/resa/getresadata`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const getDailyData = async (date) => {
  try {
    const records = await axios.post(`http://127.0.0.1:5005/api/resa/getdailydata`, { date });
    return records.data;
  } catch (error) {
    return 500;
  }
};
