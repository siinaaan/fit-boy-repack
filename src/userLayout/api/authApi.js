import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerUser = async (userData) => {
    const newUser = {
        ...userData,
        role: "user",
    };
    const response = await axios.post(
        `${API_URL}/users`,
        newUser
    );

    return response.data;
};

export const getUsers = async ()=>{
    const response = await axios.get(
        `${API_URL}/users`
    );
    return response.data
}