import React, { useEffect } from 'react'
import AuthLayouts from '../components/Layouts/AuthLayouts';
import { useNavigate } from 'react-router-dom';

const LoginsPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, []);
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-20">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-20 w-auto" src="image/logo.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Silahkan masuk untuk akses</h2>
            </div>
            <AuthLayouts/>
        </div>
    )
}

export default LoginsPage;
