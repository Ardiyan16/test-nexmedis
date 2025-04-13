import { Fragment, useEffect, useState } from "react"
import Navbar from "../components/layouts/navbar"
import LeftSide from "../components/layouts/left-side"
import { dataAtomUser, fetchDataAtomUser, profileAvatar } from "../components/hooks/dataAtom"
import { useAtom, useSetAtom } from "jotai"
import { timeAgo, urlImg } from "../components/global/global"
import api from "../api"
import { useLogin } from "../components/hooks/useLogin"


const NotificationPage = () => {
    useLogin()

    const [userData, setUserData] = useAtom(dataAtomUser)
    const [fetchUserData] = useAtom(fetchDataAtomUser)
    const imgUrl = urlImg()
    const setAvatar = useSetAtom(profileAvatar)
    const [data, setData] = useState([])

    useEffect(() => {
        setUserData(fetchUserData); // Simpan data ke global state
        const token = localStorage.getItem('token')
        if (!token) {
            resetUser()
        }
        const img = fetchUserData.images !== '' && fetchUserData.images !== null
            ? imgUrl + "/profile/" + fetchUserData.images
            : ''
        setAvatar(img)
    }, [fetchUserData, setUserData]);

    const fetchData = async () => {

        try {
            const response = await api.get('/v1/notif')
            setData(response.data.data)
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Fragment>
            <Navbar />
            <div className="container mx-auto flex pt-16 mt-3 justify-around md:px-[180px]">
                <LeftSide />
                <main className="flex-1 px-6 ml-64 md:ml-0">
                    <div className="w-full bg-white shadow-md p-4 rounded-md overflow-hidden top-16">
                        <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>

                        <ul className="max-h-80 overflow-y-auto divide-y">
                            {data.length > 0 && data.map((value, i) => (
                                <li key={i} className="p-4 hover:bg-gray-100 cursor-pointer">
                                    <p className="text-sm text-gray-800 font-medium">{value.username} {value.content}</p>
                                    <span className="text-xs text-gray-500">{timeAgo(value.created_at)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </main >
            </div >

        </Fragment >
    )

}

export default NotificationPage
