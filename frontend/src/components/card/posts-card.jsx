import { useEffect, useRef, useState } from "react";
import { timeAgo, urlImg } from "../global/global";
import Modal from "./modal";
import { InputFile } from "../form/input";
import Spinner from "../global/spinner";
import { Link } from "react-router-dom";


const PostCard = ({ value, onChange, onChangeImage, previewImage, handleSubmit, isProccess, handleIdChange, onClick, onClickLike }) => {
    const urlImage = urlImg();
    const [userId, setUserId] = useState('')
    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const menuRef = useRef()
    const time = timeAgo(value.created_at)
    const [text, setText] = useState(value.content || "");
    const [postId, setPostId] = useState(value.id || "");

    useEffect(() => {
        const user_id = localStorage.getItem('user_id')
        setUserId(user_id)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const clickEdit = () => {
        setShowModal(true)
        setOpen(false)
    }

    const handleChange = (e) => {
        setText(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    const handleChange2 = (e) => {
        setPostId(e.target.value)
    }

    return (
        <div className="w-full bg-white shadow-md p-4 rounded-md overflow-hidden top-16 mt-5">
            <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4">             {/* Header */}
                <Link to={`/postings/${value.id}`}>
                    <div className="flex items-start w-full gap-3">
                        <img
                            src={value.image_profile ? urlImage + '/profile/' + value.image_profile : 'image/user.png'}
                            alt={``}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold">{value.username}</h3>
                            <p className="text-xs text-gray-500">{time}</p>
                        </div>

                        {value.user_id == userId && (
                            <div ref={menuRef}>
                                <div className="flex items-end cursor-pointer" onClick={() => setOpen(!open)}>
                                    ....
                                </div>

                                {open &&
                                    <div className="absolute right-40 mt-0 w-40 bg-white shadow-md rounded-md py-1 z-50 border-gray-200">
                                        <button type="button" onClick={clickEdit} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                            Edit
                                        </button>
                                        <button type="button" onClick={() => onClick(value.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                            Delete
                                        </button>
                                    </div>
                                }
                            </div>

                        )}
                    </div>
                </Link>

                <div className="mt-4 text-gray-800 whitespace-pre-line">{value.content}</div>

                {value.images && (
                    <div className="mt-4">
                        <img
                            src={urlImage + '/posts/' + value.images}
                            alt="Post content"
                            className="w-full max-h-96 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center text-gray-500 text-sm mt-10">
                    <div className="text-xs items-center text-gray-600">{value.total_like} Like</div>
                    <div className="text-xs items-center text-gray-600">{value.total_comment} Comment</div>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm mt-4 border-t pt-3">
                    <button type="button" onClick={value.liked_by_user ? () => onClickLike(value.like_id, value.user_id, 'unlike') : () => onClickLike(value.id, value.user_id, 'like')} className={`flex items-center gap-1 ${value.liked_by_user ? 'text-blue-500' : ''} `}>
                        <i className="fas fa-thumbs-up"></i> Like
                    </button>
                    <Link to={`/postings/${value.id}`} className="flex items-center gap-1">
                        <i className="fa fa-comment" /> Comment
                    </Link>
                </div>

            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-2">Form Edit Postingan!</h2>
                <hr className="mt-3" />
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div>
                        <input type="hidden" value={postId} name="id" id="id" onChange={handleChange2} />
                        <textarea
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder={`what do you want to say, ${value.username}`}
                            value={text}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-5">
                        <InputFile name="images" onChange={onChangeImage} accept="image/*" label="Upload Photo Profile" />
                    </div>
                    <div className="grid grid-cols-2">
                        {value.images &&
                            <div className="py-2 mt-3 px-3">
                                <img src={urlImage + '/posts/' + value.images} className="w-[300px] h-[200px]" />
                                <p>Old Image</p>
                            </div>
                        }
                        {previewImage &&
                            <div className="py-2 mt-3 px-3">
                                <img src={previewImage} className="w-[300px] h-[200px]" />
                                <p>New Image</p>
                            </div>
                        }
                    </div>

                    <div className="mt-5">
                        <button type="submit"
                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700" disabled={isProccess}>
                            {isProccess ? <Spinner /> : 'Update'}
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
        </div>
    )
}

export default PostCard

