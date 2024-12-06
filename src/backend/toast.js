import { toast } from "react-toastify"

const toast_success = (message) => {
    toast.success(message, {

    })
}
const toast_error = (message) => {
    toast.error(message, {
    })
}

const toast_info = (message) => {
    toast.info(message, {

    })
}

export {toast_error, toast_success, toast_info};