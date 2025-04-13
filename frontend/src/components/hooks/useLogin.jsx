
import { useEffect, useState } from "react";
// import { getUsername } from "../services/product.service";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { Notif, Notification } from "../global/notif";

export const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation()
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        const code = localStorage.getItem("code");
        const exp_token = localStorage.getItem("exp_token");
        if (!token || !userId || !code || !exp_token) {
            // Notif('Failed', 'You do not have access, please login', "error", 3000).then(() => {
                navigate("/");
            // });
        }

        // if(token || userId || code || exp_token) {
        //     navigate("/home")
        // }

        const checkUser = async () => {
            try {
                const response = await api.get("/v1/check-user");
                const data = response.data.data
                return data
            } catch (error) {
                if (error.response?.data?.status === false) {
                    Notification(error.response.data.message, "error", 3000);
                    setTimeout(() => {
                        localStorage.clear();
                        navigate("/");
                    }, 3000)
                }
            }
        };

        checkUser()
    }, []);

};

export const alreadyLogIn = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        const code = localStorage.getItem("code");
        const exp_token = localStorage.getItem("exp_token");
        if (token || userId || code || exp_token) {
            navigate("/home");
        }
    }, [navigate])

}
