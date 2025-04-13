import axios from "axios"
import { Fragment, useState } from "react"
import { ToastContainer } from "react-toastify"
import { Notification } from "../../components/global/notif"
import { useNavigate } from "react-router-dom"
import { urlApi } from "../../components/global/global"
import { alreadyLogIn } from "../../components/hooks/useLogin"

const ForgotPasswordPage = () => {
    alreadyLogIn()
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const [validation, setValidation] = useState([])
    const [form, setForm] = useState({
        username_email: '',
        password: '',
        password_confirmation: ''
    })
    const [passwordCheck, setPasswordCheck] = useState('')
    const [isProccess, setIsProccess] = useState(false)

    const onChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (form.password_confirmation == '') {
            setPasswordCheck('password confirmation is required')
            return setIsProccess(false)
        }
        if (form.password != form.password_confirmation) {
            setPasswordCheck('password confirmation does not match')
            return setIsProccess(false)
        }
        setPasswordCheck('')
        const formVal = new FormData
        formVal.append('username_email', form.username_email)
        formVal.append('password', form.password)
        formVal.append('password_confirmation', form.password_confirmation)
        const apiUrl = urlApi()
        await axios.post(apiUrl + '/forgot', formVal).then((response) => {
            setIsProccess(false)
            Notification(response.data.message, 'success', 2500)
            setTimeout(() => {
                setForm({
                    username_email: '',
                    password: '',
                    password_confirmation: ''
                })
                navigate('/')
            }, 2600)
        }).catch((error) => {
            setIsProccess(false)
            if (error.response.data.info == 'validation_error') {
                setValidation(error.response.data.errors)
            }
            Notification(error.response.data.message, 'error', 2500)
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
                                Forgot password to change password
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="username_email" className="block mb-2 text-sm font-medium text-slate-600">Email or Username</label>
                                    <input type="text" name="username_email" id="username_email" value={form.username_email} onChange={(e) => onChange(e)} className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com or username" required="" />
                                    {validation.username_email && <small className="text-red-500">{validation.username_email}</small>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-600 ">New Password</label>
                                    <div className="relative">
                                        <input type={viewPassword ? 'text' : 'password'} name="password" id="password" value={form.password} onChange={(e) => onChange(e)} placeholder="••••••••" className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required="" />
                                        <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={() => setViewPassword(!viewPassword)}>
                                            {viewPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                        </button>
                                    </div>
                                    {validation.password && <small className="text-red-500">{validation.password}</small>}
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-slate-600 ">Confirm New Password</label>
                                    <div className="relative">
                                        <input type={viewPassword ? 'text' : 'password'} name="password_confirmation" id="confirm_password" value={form.password_confirmation} onChange={(e) => onChange(e)} placeholder="••••••••" className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required="" />
                                        <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={() => setViewPassword(!viewPassword)}>
                                            {viewPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                        </button>
                                    </div>
                                    {passwordCheck && <small className="text-red-500">{passwordCheck}</small>}
                                </div>
                                <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center gap-2" disabled={isProccess}>{isProccess ? <Spinner /> : ''} Change Password</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                You want to sign in ? <a href="/" className="font-medium text-blue-500 hover:underline">Sign In</a>
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

export default ForgotPasswordPage
