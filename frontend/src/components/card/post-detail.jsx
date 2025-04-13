import { timeAgo, urlImg } from "../global/global";

export const CardPostDetail = ({ value }) => {
    const urlImage = urlImg();

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                <img src={value.image_profile ? urlImage + '/profile/' + value.image_profile : '/image/user.png'} className="w-10 h-10 rounded-full" alt="Avatar" />
                <div>
                    <h4 className="font-semibold text-gray-800">{value.username}</h4>
                    <span className="text-sm text-gray-500">{timeAgo(value.created_at)}</span>
                </div>
            </div>
            <p className="text-gray-800 mb-4">
                {value.content}
            </p>

            {value.images && (
                <div className="mt-4">
                    <img
                        src={urlImage + '/posts/' + value.images}
                        alt="Post content"
                        className="w-full max-h-96 object-cover rounded-lg"
                    />
                </div>
            )}
        </div>
    )
}
