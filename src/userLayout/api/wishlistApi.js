import axios from "axios";

const API_URL = "http://localhost:5000";

export const getWishlistItems = async (userId) => {
    const response =  await axios.get(
        `${API_URL}/wishlistItems?userId=${userId}`
    );
    return response.data;
};

export const addWishlistItem = async(wishlistItem) => {
    const response = await axios.post(
        `${API_URL}/wishlistItems`,
        wishlistItem
    );
    return response.data
};


export const deleteWishlistItem = async (id) => {
    const response = await axios.delete(
        `${API_URL}/wishlistItems/${id}`
    );
    return response.data;
};