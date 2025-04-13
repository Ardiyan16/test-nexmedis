import { Fragment, useEffect, useState } from "react"
import Navbar from "../components/layouts/navbar"
import { useLogin } from "../components/hooks/useLogin"
import LeftSide from "../components/layouts/left-side"
import { useAtom, useSetAtom } from "jotai"
import { dataAtomUser, fetchDataAtomUser, profileAvatar, resetUserAtom } from "../components/hooks/dataAtom"
import { FormInputPost } from "../components/form/posting"
import { ConfirmDelete, Notification } from "../components/global/notif"
import { ToastContainer } from "react-toastify"
import api from "../api"
import PostCard from "../components/card/posts-card"
import { urlImg } from "../components/global/global"

const HomePage = () => {
    useLogin()

    const [userData, setUserData] = useAtom(dataAtomUser)
    const [fetchUserData] = useAtom(fetchDataAtomUser)
    const [content, setContent] = useState('');
    const [images, setImages] = useState(null)
    const [isProcess, setIsProcess] = useState(false)
    const [, resetUser] = useAtom(resetUserAtom);
    const [dataPost, setDataPost] = useState([])
    const [hasMore, setHasMore] = useState(true)
    // const [nextPageUrl, setNextPageUrl] = useState("/v1/posts?page=1");
    const [loading, setLoading] = useState(false)
    const imgUrl = urlImg()
    const setAvatar = useSetAtom(profileAvatar)
    const [id, setId] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await api.get('/v1/posts')
            setDataPost(response.data.data)
            setLoading(false)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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



    const onChangeImage = (e) => {
        const file = e.target.files[0]
        setImages(file)
    }

    const handleContentChange = (text) => {
        setContent(text);
    };

    const handleIdChange = (id) => {
        setId(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcess(true)

        if (content == '') {
            setIsProcess(false)
            return Notification('Post content must be filled in', 'info', 2500)
        }

        const formVal = new FormData
        formVal.append('content', content)
        formVal.append('images', images)
        await api.post('/v1/posts/add', formVal).then((response) => {
            setIsProcess(false)
            setContent('')
            setImages(null)
            fetchData()
            setUserData(fetchUserData);
            // Notification(response.data.message, 'success', 2500)
        }).catch((error) => {
            setIsProcess(false)
            Notification(error.response.data.message, 'error', 2500)
        })

    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault()

        setIsProcess(true)
        if (content == '') {
            setIsProcess(false)
            return Notification('Post content must be filled in', 'info', 2500)
        }

        const formVal = new FormData
        formVal.append('content', content)
        formVal.append('images', images)
        formVal.append('id', id)
        await api.post('/v1/posts/edit', formVal).then((response) => {
            setIsProcess(false)
            setContent('')
            setImages(null)
            fetchData()
            setUserData(fetchUserData);
            // Notification(response.data.message, 'success', 2500)
        }).catch((error) => {
            setIsProcess(false)
            Notification(error.response.data.message, 'error', 2500)
        })
    }

    const handleDelete = (id) => {
        ConfirmDelete('Post data will be deleted', 'question').then((result) => {
            if (result.isConfirmed) {
                api.get('/v1/posts/delete/' + id).then((response) => {
                    fetchData()
                    setUserData(fetchUserData);
                    Notification(response.data.message, 'success', 2500)
                }).catch((error) => {
                    Notification(error.response.data.message, 'error', 2500)
                })
            }
        })
    }

    const handleClickLike = async (id, user_id, type) => {
        if(type == 'like') {
            await api.post('/v1/like/add', {
                post_id: id,
                user_id: user_id
            }).then((response) => {
                fetchData()
            }).catch((error) => {
                console.error(error);
            })
        } else if(type == 'unlike') {
            await api.get('/v1/like/delete/' + id).then((response) => {
                fetchData()
            }).catch((error) => {
                console.error(error);
            })
        }
    }

    return (
        <Fragment>
            <Navbar />
            <div className="container mx-auto flex pt-16 mt-3 justify-around md:px-[180px]">
                <LeftSide />
                <main className="flex-1 px-6 ml-64 md:ml-0">
                    <div className="w-full bg-white shadow-md p-4 rounded-md overflow-hidden top-16">
                        <FormInputPost value={content} onChange={(e) => setContent(e.target.value)} onChangeImage={onChangeImage} handleSubmit={handleSubmit} previewImg={images ? URL.createObjectURL(images) : ''} isProcess={isProcess} />
                    </div>
                    <div className="mb-10">
                        {dataPost && dataPost.map((value, i) => (
                            <div key={i}>
                                <PostCard value={value} onChange={handleContentChange} onChangeImage={onChangeImage} previewImage={images ? URL.createObjectURL(images) : ''} handleSubmit={handleSubmitEdit} isProccess={isProcess} handleIdChange={handleIdChange} onClick={handleDelete} onClickLike={handleClickLike} />
                            </div>
                        ))}
                        {/* {hasMore && (
                            <div className="mt-5 text-center">
                                <button
                                    onClick={fetchData}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )} */}
                    </div>
                </main>
            </div>
            <ToastContainer />
        </Fragment>
    )

}

export default HomePage
