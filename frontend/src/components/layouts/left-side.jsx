import { useAtom, useAtomValue } from "jotai"
import { dataAtomUser, profileAvatar } from "../hooks/dataAtom"
import { Link } from "react-router-dom"

const LeftSide = () => {
    const [userData] = useAtom(dataAtomUser) || ''
    const avatar = useAtomValue(profileAvatar)
    return (
        <>
            <div className="w-80 self-start bg-white shadow-md rounded-lg di overflow-hidden top-16 sticky">
                <div className="relative pt-16">
                    <img src={avatar !== '' ? avatar : '/image/user.png'} alt="Profile" className="w-16 h-16 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 -bottom-8" />
                </div>
                <div className="text-center pt-10 pb-4 px-4">
                    <Link to="/profile">
                        <h2 className="text-lg font-semibold hover:text-blue-400 text-gray-800">{userData?.username ? userData?.username : ''}</h2>
                        <p className="text-sm hover:text-blue-400 text-gray-500">{userData?.email}</p>
                    </Link>
                </div>
                <div className="border-t border-gray-200">
                    <a href="#" className="flex justify-between px-4 py-2 hover:bg-gray-100">
                        <span className="text-sm text-gray-600">Your Post</span>
                        <span className="text-sm font-semibold text-blue-600">{userData?.total_posts}</span>
                    </a>
                    <a href="#" className="flex justify-between px-4 py-2 hover:bg-gray-100">
                        <span className="text-sm text-gray-600">Like Your Post</span>
                        <span className="text-sm font-semibold text-blue-600">{userData?.total_like}</span>
                    </a>
                </div>
                <div className="border-t border-gray-200 py-4 px-4 text-center">
                    <Link to="/profile" className="text-sm text-gray-500 hover:underline">View Profile</Link>
                </div>
            </div>

        </>
    )

}

export default LeftSide
