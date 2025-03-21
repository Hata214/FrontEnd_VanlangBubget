import axios from 'axios'
import { authService } from './authService'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cho phép gửi cookie trong các request
})

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
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
            authService.logout()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api 