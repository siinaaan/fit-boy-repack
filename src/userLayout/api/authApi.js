import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}/users`,
        userData
    );

    return response.data;
};

export const getUsers = async ()=>{
    const response = await axios.get(
        `${API_URL}/users`
    );
    return response.data
}