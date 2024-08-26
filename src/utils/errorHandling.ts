import Swal from "sweetalert2";
import Cookies from 'js-cookie';
// Pinia
import { useAuthStore } from "@/stores/authStore";
/*
Function Error Handling
*/


const unauthorized = () => {
    const auth = useAuthStore()
    auth.logout()
    Cookies.remove('token')
    Swal.fire({
        icon: 'warning',
        title: 'Token anda sudah habis',
        text: 'Sistem akan secara otomatis memindahkan anda untuk login kembali',
        showConfirmButton: false,
        timer: 3000
    })
}

const errorNetwork = () => {
    Swal.fire({
        icon: 'warning',
        title: 'Something Went Wrong',
        text: 'Unable to reach information, please check your network.',
        showConfirmButton: false,
        timer: 3000
    })
}


const requestTimeout = () => {
    Swal.fire({
        icon: 'warning',
        title: 'Jaringan terlalu lambat, periksa kembali jaringan anda.',
    })
}

const errorHandling = (error: any) => {
    if (error.code == "ERR_NETWORK") {
        errorNetwork()
    }
    else if (error.code == "ECONNABORTED") {
        requestTimeout()
    }
    
    if (error?.response?.status == 401 || error?.response?.status == 403) {
        unauthorized()
        return window.location.href = '/login'
    }

}

export {
    errorHandling
}