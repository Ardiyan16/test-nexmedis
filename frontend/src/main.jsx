import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './css/index.css'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import ForgotPasswordPage from './pages/auth/forgot'
import HomePage from './pages/beranda'
import ProfilePage from './pages/profile'
import NotificationPage from './pages/notification'
import PostingPage from './pages/postings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  
  
  {
    path: '/home',
    element: <HomePage />
  },

  {
    path: '/profile',
    element: <ProfilePage />,
  },

  {
    path: '/notification',
    element: <NotificationPage />,
  },

  {
    path: '/postings/:id',
    element: <PostingPage />,
  },
  
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
