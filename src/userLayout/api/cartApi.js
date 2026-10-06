import axios from "axios";

const API_URL = "http://localhost:5000";

export const getCartItems = async (userId) => {
  const response = await axios.get(
    `${API_URL}/cartItems?userId=${userId}`
  );

  return response.data;
};

export const addCartItem = async (cartItem) => {
  const response = await axios.post(
    `${API_URL}/cartItems`,
    cartItem
  );

  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await axios.patch(
    `${API_URL}/cartItems/${id}`,{quantity}
  );

  return response.data;
};

export const deleteCartItem = async (id) => {
  const response = await axios.delete(
    `${API_URL}/cartItems/${id}`
  );

  return response.data;
};