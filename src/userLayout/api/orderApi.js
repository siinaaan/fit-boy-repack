import axios from "axios";

const API_URL = "http://localhost:5000";

export const createOrder = async(order) => {
    const response = await axios.post(`${API_URL}/orders`,order);
    return response.data;
};

export const getOrderById = async(orderId) => {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
}