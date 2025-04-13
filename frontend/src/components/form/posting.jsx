import { useAtom, useAtomValue } from "jotai"
import { dataAtomUser, profileAvatar } from "../hooks/dataAtom"
import Spinner from "../global/spinner"

export const FormInputPost = (props) => {
    const [userData] = useAtom(dataAtomUser)
    const avatar = useAtomValue(profileAvatar)
    const { value, onChange, handleSubmit, onChangeImage, previewImg, isProcess } = props

    return (
        <div>
            <div className="bg-slate-100 p-4 shadow-md rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <img
                            src={avatar !== '' ? avatar : '/image/user.png'}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />

                        {/* Textarea */}
                        <div className="flex-1">
                            <textarea
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder={`what do you want to say, ${userData?.username}?`}
                                value={value}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    {previewImg &&
                        <div className="ml-10 py-2 mt-3 px-3">
                            <img src={previewImg} className="w-[300px] h-[200px]" />
                        </div>
                    }
                    <div className="mt-3 flex justify-between items-center gap-3">
                        {/* <button type="button" onClick={() => setIsOpen(!isOpen)} className="px-4 ml-10 py-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                            <i className="fas fa-images"></i> Images
                        </button> */}
                        <label htmlFor="file-input" className="sr-only">Upload Image</label>
                        <input type="file" name="images" onChange={onChangeImage} accept="image/*" id="file-input" className="block w-full border bg-white border-gray-300 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-100 file:border-0 file:me-4 file:py-3 file:px-4 ml-10" />
                    </div>
                    <div className="mt-3 text-end">
                        <button type="submit"
                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700" disabled={isProcess}>
                            {isProcess ? <Spinner /> : 'Posts'}
                        </button>

                    </div>
                </form>
            </div >


            {/* <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="text-xl font-semibold mb-2">Upload Image</h2>
                <hr />
                <div className="mt-3 mb-3">
                    
                </div>

                <hr />
                <div className="text-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-red-500 text-white px-4 py-2 mt-3 rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                </div>
            </Modal> */}
        </div >
    )

}
