import Swal from "sweetalert2"
import { toast } from "react-toastify"

export const Notif = (title, message, status, timer) => {
    return Swal.fire({
        title: title,
        text: message,
        icon: status,
        timer: timer,
        showCancelButton: false,
        showConfirmButton: false,
    })
    
}

export const ConfirmDelete = (message, status) => {
    return Swal.fire({
        title: 'Apa anda yakin?',
        text: message,
        icon: status,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898989',
        confirmButtonText: 'Yes, Delete!'
    })
}

export const ConfirmLogout = (message, status) => {
    return Swal.fire({
        title: 'Are you sure ?',
        text: message,
        icon: status,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898989',
        confirmButtonText: 'Logout!'
    })
}

export const Notification = (message, type, timer) => {
    if (type === 'success') {
        return toast.success(message, {
            position: "top-right",
            autoClose: timer
        })
    } else if (type === 'error') {
        return toast.error(message, {
            position: "top-right",
            autoClose: timer
        })
    } else if (type === 'warning') {
        return toast.warning(message, {
            position: "top-right",
            autoClose: timer
        })
    } else if (type === 'info') {
        return toast.info(message, {
            position: "top-right",
            autoClose: timer
        })
    }
}
