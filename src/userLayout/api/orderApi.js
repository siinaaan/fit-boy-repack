import axios from "axios";

const API_URL = "http://localhost:5000";

export const createOrder = async (order) => {
  const response = await axios.post(`${API_URL}/orders`, order);
  return response.data;
};

export const getOrderByUser = async (userId) => {
  const response = await axios.get(
    `${API_URL}/orders?userId=${userId}`
  );
  return response.data;
};

export const updateOrder = async (orderId, data) => {
  const response = await axios.patch(
    `${API_URL}/orders/${orderId}`,
    data
  );
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axios.delete(
    `${API_URL}/orders/${orderId}`
  );
  return response.data;
};