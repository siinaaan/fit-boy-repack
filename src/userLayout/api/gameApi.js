import axios from "axios";

const API_URL = "http://localhost:5000";

export const getGames = async()=>{
const response = await axios.get(`${API_URL}/games`);

return response.data
};

export const getGameById = async (id) => {
    const response = await axios.get(
        `${API_URL}/games/${id}`
    );
    return response.data
}