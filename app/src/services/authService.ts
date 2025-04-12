import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (email: string, password: string, name: string) => {
    const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name
    }, {
        withCredentials: true
    });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password
    }, {
        withCredentials: true
    });
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
    });
    return response.data;
}; 