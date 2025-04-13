import { Fragment, useEffect, useState } from "react"
import Navbar from "../components/layouts/navbar"
import api from "../api"
import { useAtomValue, useSetAtom } from "jotai"
import { profileAvatar } from "../components/hooks/dataAtom"
import { urlImg } from "../components/global/global"
import Modal from "../components/card/modal"
import { Input, InputFile } from "../components/form/input"
import Spinner from "../components/global/spinner"
import { Notification } from "../components/global/notif"


const ProfilePage = () => {

    const [data, setData] = useState({})
    const [showModal, setShowModal] = useState(false)
    const imgUrl = urlImg()
    const setAvatar = useSetAtom(profileAvatar)
    const [username, setUsername] = useState('')
    const [images, setImages] = useState(null)
    const [validation, setValidation] = useState([])
    const [isProccess, setIsProccess] = useState(false)
    const [prevImg, setPrevImg] = useState(null)

    const fetchData = async () => {
        try {
            const response = await api.get('/v1/user')
            const data = response.data.data
            setData(data)
            setUsername(data.username)
            setPrevImg(data.images ? imgUrl + "/profile/" + data.images : '')
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData()
        const img = prevImg !== '' ? prevImg : ''
        setAvatar(img)
    }, [prevImg])

    const onChange = (e) => {
        const file = e.target.files[0]
        setImages(file)
    }

    const avatar = useAtomValue(profileAvatar)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProccess(true)

        const formVal = new FormData
        formVal.append('username', username)
        formVal.append('images', images)
        await api.post('/v1/edit-profile', formVal).then((response) => {
            fetchData()
            setShowModal(false)
            Notification(response.data.message, 'success', 2500)
        }).catch((error) => {
            setIsProccess(false)
            if (error.response.data.info == 'validation_error') {
                return setValidation(error.response.data.errors)
            }
            return Notification(error.response.data.message, 'error', 2500)
        })
    }

    return (
        <Fragment>
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-10 px-4 top-16 mt-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img src={data.images ? avatar : 'image/user.png'} alt="Profile Picture"
                            className="w-32 h-32 rounded-full shadow-md border-4 border-white" />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">{data.username}</h2>
                            <p className="text-gray-500">{data.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-auto">
                            <button type="button" onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xl font-bold text-gray-700">{data.total_posts}</p>
                            <p className="text-gray-500">Posts</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-700">{data.total_like}</p>
                            <p className="text-gray-500">Followers</p>
                        </div>
                    </div>

                    {/* <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Posts</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg shadow">
                                <p className="text-gray-800">Just finished my Vue.js + Tailwind CSS profile page! 🚀</p>
                                <span className="text-sm text-gray-400">2 hours ago</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow">
                                <p className="text-gray-800">Loving the new features in Node.js 20! ❤️</p>
                                <span className="text-sm text-gray-400">1 day ago</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-2">Form Edit Profile!</h2>
                <hr className="mt-3" />
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div>
                        <Input label="Username" name="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                        {validation.username && <small className="text-red-500">{validation.username}</small>}
                    </div>
                    <div className="mt-5">
                        <InputFile name="images" onChange={onChange} accept="image/*" label="Upload Photo Profile" />
                        {validation.images && <small className="text-red-500">{validation.images}</small>}
                    </div>
                    <div className="grid grid-cols-2">
                        {prevImg &&
                            <div className="py-2 mt-3 px-3">
                                <img src={prevImg} className="w-[300px] h-[200px]" />
                                <p>Old Image</p>
                            </div>
                        }
                        {images &&
                            <div className="py-2 mt-3 px-3">
                                <img src={URL.createObjectURL(images)} className="w-[300px] h-[200px]" />
                                <p>New Image</p>
                            </div>
                        }
                    </div>

                    <div className="mt-5">
                        <button type="submit"
                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700" disabled={isProccess}>
                            {isProccess ? <Spinner /> : 'Save & Update'}
                        </button>

                    </div>

                </form>

                <hr className="mb-3 mt-3" />
                <div className="text-end">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </Fragment>
    )

}

export default ProfilePage
