import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ConfirmLogout, Notification } from "../global/notif"
import { ToastContainer } from "react-toastify"
import { useAtom, useAtomValue } from "jotai"
import { dataAtomUser, profileAvatar, resetAvatar, resetUserAtom } from "../hooks/dataAtom"
import api from "../../api"

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownProfile, setDrodownProfile] = useState(false)
    const dropdownRef = useRef(null);
    const [user] = useAtom(dataAtomUser)
    const [, resetUser] = useAtom(resetUserAtom);
    const avatarProfile = useAtomValue(profileAvatar)
    const [notif, setNotif] = useState('')

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDrodownProfile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logoutHandle = () => {
        ConfirmLogout('you will be logged out of NexmedisSocmed', 'question').then((result) => {
            if (result.isConfirmed) {
                resetUser()
                localStorage.clear()
                Notification('You successfully logged out', 'success', 2500)
                setTimeout(() => {
                    window.location.href = '/'
                }, 2600)
            }
        })
    }

    const fetchNotif = async () => {

        try {
            const response = await api.get('/v1/notif')
            setNotif(response.data.count)
        } catch (error) {
            console.error(error);

        }

    }

    useEffect(() => {
        fetchNotif()
    }, [])

    const handleReadNotif = async () => {
        
        await api.get('/v1/read-notif').then(() => {
            navigate('/notification')
        }).catch((error) => {
            console.error(error);
            
        })

    }

    return (
        <div>
            <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto flex justify-around items-center p-2">
                    <a href="#" className="text-blue-700 font-bold text-xl flex items-center">
                        <img src="/image/logo2.png" alt="LinkedIn Logo" className="w-28 h-8 mr-2" />
                        SocMed
                    </a>

                    <nav className="hidden md:flex space-x-6">
                        <Link to="/home" className="text-gray-500 hover:text-blue-500 flex flex-col items-center">
                            <i className="fas fa-home text-xl"></i>
                            <span className="text-xs">Home</span>
                        </Link>
                        {/* <Link to="#" className="text-gray-500 hover:text-blue-500 flex flex-col items-center">
                            <i className="fas fa-thumbs-up text-xl"></i>
                            <span className="text-xs">Your Like</span>
                        </Link> */}
                        <button type="button" onClick={handleReadNotif} className="text-gray-500 hover:text-blue-500 flex flex-col items-center">
                            {notif !== 0 &&
                                <span className="absolute top-0.5 bg-red-600 ml-4 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {notif}
                                </span>
                            }
                            <i className="fas fa-bell text-xl"></i>
                            <span className="text-xs">Notifications</span>
                        </button>
                    </nav>

                    <div className="flex items-center space-x-4" ref={dropdownRef}>
                        <button onClick={() => setDrodownProfile(!dropdownProfile)} className="flex items-center space-x-2 focus:outline-none">
                            <img src={avatarProfile !== "" ? avatarProfile : '/image/user.png'} alt="Profile" className="w-8 h-8 rounded-full" />
                            <i className={`fas fa-chevron-down text-gray-600 transition duration-500 transform-gpu ${dropdownProfile ? 'rotate-180' : ''}`}></i>
                        </button>

                        {dropdownProfile &&
                            <div className="absolute right-28 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">{user.username}</Link>
                                <div className="border-t border-gray-200"></div>
                                <button type="button" onClick={logoutHandle} className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                            </div>
                        }
                    </div>
                </div>
            </header>
            <ToastContainer />
        </div>
    )

}

export default Navbar
