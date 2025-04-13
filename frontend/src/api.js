import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    // withCredentials: true, // Important for authentication
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

api.interceptors.request.use(
    async (config) => {
        const headers = {
            token: localStorage.getItem("token"),
            user_id: localStorage.getItem("user_id"),
            code: localStorage.getItem("code"),
            exp_token: localStorage.getItem("exp_token"),
        };

        if (headers.token) {
            Object.keys(headers).forEach((key) => {
                if (headers[key]) {
                    config.headers[key] = headers[key];
                }
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.data.message || error.response.statusText);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
