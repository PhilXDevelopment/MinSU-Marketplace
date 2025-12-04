import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const signInUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/signin`, userData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { error: "Something went wrong" };
    }
};

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/register`, userData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { error: "Something went wrong" };
    }
};
