import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cho phép gửi cookie trong các request
})

// Giảm circular dependency
const getToken = (): string | undefined => {
    return Cookies.get('token')
}

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Xóa token và chuyển hướng về trang login
            Cookies.remove('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api 