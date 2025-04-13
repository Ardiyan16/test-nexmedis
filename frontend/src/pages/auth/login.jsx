import { use } from "react"
import { Fragment, useState } from "react"
import { ToastContainer } from "react-toastify"
import { Notification } from "../../components/global/notif"
import axios from "axios"
import { urlApi } from "../../components/global/global"
import Spinner from "../../components/global/spinner"
import { useNavigate } from "react-router-dom"
import { alreadyLogIn } from "../../components/hooks/useLogin"


const LoginPage = () => {
    alreadyLogIn()
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const [usernameEmail, setUsernameEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validation, setValidation] = useState([])
    const [isProccess, setIsProccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProccess(true)

        const formVal = new FormData
        formVal.append('username_email', usernameEmail)
        formVal.append('password', password)
        const apiUrl = urlApi()
        await axios.post(apiUrl + '/login', formVal)
            .then((response) => {
                localStorage.setItem('token', response.data.data.token)
                localStorage.setItem('code', response.data.data.code)
                localStorage.setItem('exp_token', response.data.data.exp_token)
                localStorage.setItem('user_id', response.data.data.user_id)
                Notification(response.data.message, 'success', 2000)
                setTimeout(() => {
                    navigate('/home')
                }, 2100)
            }).catch((error) => {
                setIsProccess(false)
                if (error.response.data.info == 'validation_error') {
                    setValidation(error.response.data.errors)
                }
                Notification(error.response.data.message, 'error', 3000)
            })
    }

    return (
        <Fragment>
            <section className="bg-slate-200">
                <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-0 text-2xl font-semibold text-slate-700">
                        <img className="w-48 h-48" src="image/logo.png" alt="logo" />
                        <span className="pt-3">SocMed</span>
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-700 md:text-2xl">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="username_email" className="block mb-2 text-sm font-medium text-slate-600">Email Or Username</label>
                                    <input type="text" name="username_email" id="username_email" value={usernameEmail} onChange={(e) => setUsernameEmail(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com / username" required="" />
                                    {validation.username_email && <small className="text-red-500">{validation.username_email}</small>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-600 ">Password</label>
                                    <div className="relative">
                                        <input type={viewPassword ? 'text' : 'password'} name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required="" />
                                        <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={() => setViewPassword(!viewPassword)}>
                                            {viewPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                        </button>
                                    </div>
                                    {validation.password && <small className="text-red-500">{validation.password}</small>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                    </div>
                                    <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center gap-2" disabled={isProccess}>{isProccess ? <Spinner /> : ''} Sign In</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <a href="/register" className="font-medium text-blue-500 hover:underline">Sign Up</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </Fragment>
    )

}

export default LoginPage

