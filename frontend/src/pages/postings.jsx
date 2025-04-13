import { Fragment, useEffect, useState } from "react"
import Navbar from "../components/layouts/navbar"
import { useLogin } from "../components/hooks/useLogin"
import { useAtom, useSetAtom } from "jotai"
import { dataAtomUser, fetchDataAtomUser, profileAvatar } from "../components/hooks/dataAtom"
import { timeAgo, urlImg } from "../components/global/global"
import LeftSide from "../components/layouts/left-side"
import { useParams } from "react-router-dom"
import { CardPostDetail } from "../components/card/post-detail"
import api from "../api"
import Spinner from "../components/global/spinner"
import { Notification } from "../components/global/notif"
import { ToastContainer } from "react-toastify"

const PostingPage = () => {
    useLogin()

    const { id } = useParams()
    const [data, setData] = useState({})
    const [comment, setComment] = useState([])
    const [userData, setUserData] = useAtom(dataAtomUser)
    const [fetchUserData] = useAtom(fetchDataAtomUser)
    const imgUrl = urlImg()
    const setAvatar = useSetAtom(profileAvatar)
    const [content, setContent] = useState('')
    const [postId, setPostId] = useState(null)
    const [userId, setUserId] = useState(null)
    const [isProccess, setIsProccess] = useState(false)
    const [idUser, setIdUser] = useState('')

    useEffect(() => {
        setUserData(fetchUserData); // Simpan data ke global state
        const token = localStorage.getItem('token')
        const user_id = localStorage.getItem('user_id')
        setIdUser(user_id)
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
            const response = await api.get('/v1/posts/show/' + id)
            const data = response.data.data
            setData(data)
            setPostId(data.id)
            setUserId(data.user_id)
            setComment(response.data.comment)
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (content == '') {
            return Notification('Post content comments must be filled in')
        }

        const formVal = new FormData
        formVal.append('post_id', postId)
        formVal.append('user_id', userId)
        formVal.append('content', content)
        await api.post('/v1/comments/add', formVal).then((response) => {
            fetchData()
            setUserId(null)
            setPostId(null)
            setContent('')
        }).catch((error) => {
            console.error(error);

        })

    }

    return (
        <Fragment>
            <Navbar />
            <div className="container mx-auto flex pt-16 mt-3 justify-around md:px-[180px]">
                <LeftSide />
                <main className="flex-1 px-6 ml-64 md:ml-0">
                    <div className="w-full bg-white shadow-md p-4 rounded-md overflow-hidden top-16">
                        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
                            <CardPostDetail value={data} />
                            <hr className="my-6" />

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Comments ({data.total_comment})</h3>


                                <div className="space-y-4">
                                    {comment.length > 0 && comment.map((val, i) => (
                                        <div className="flex gap-3">
                                            <img src={val.images ? imgUrl + '/profile/' + val.images : '/image/user.png'} className="w-10 h-10 rounded-full" alt="Avatar" />
                                            <div className="bg-gray-100 p-3 rounded-xl w-full">
                                                <div className="flex justify-between">
                                                    <h4 className="font-semibold text-sm text-gray-800">{val.username} </h4>
                                                    {idUser == val.user_id &&
                                                        <button type="button" title="Delete Comment">
                                                            <i className="fas fa-trash-can"></i>
                                                        </button>
                                                    }
                                                </div>
                                                <div className="flex justify-between mt-3">
                                                    <p className="text-sm text-gray-700 mt-1">{val.content}</p>
                                                    <span className="text-xs text-gray-500">{timeAgo(val.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form className="mt-6" onSubmit={handleSubmit}>
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl resize-none focus:outline-none focus:ring focus:border-blue-500"
                                        rows="3" placeholder="Write a comment..."></textarea>
                                    <div className="flex justify-end mt-2">
                                        <button type="submit"
                                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700" disabled={isProccess}>
                                            {isProccess ? <Spinner /> : 'Posts Comments'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </Fragment>
    )

}

export default PostingPage 
