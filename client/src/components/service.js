import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error registering user" };
    }
};

export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Login failed" };
    }
};

export const getUserProfile = async (userId) => {
    try {
        // Send GET request to fetch user data
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;  // Assuming the backend returns the user data in the response
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        
        // Optionally return a fallback error message to the UI or throw an error
        throw error;  // Rethrow error to be caught in the calling function
    }
};
