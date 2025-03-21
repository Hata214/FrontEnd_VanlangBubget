import api from './api'
import Cookies from 'js-cookie'

interface LoginData {
    email: string
    password: string
}

interface RegisterData extends LoginData {
    name: string
}

interface AuthResponse {
    user: {
        id: string
        email: string
        name: string
    }
    token: string
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data)
        const { token } = response.data
        // Lưu token vào cookie với thời hạn 7 ngày
        Cookies.set('token', token, { expires: 7, secure: true })
        return response.data
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data)
        const { token } = response.data
        // Lưu token vào cookie với thời hạn 7 ngày
        Cookies.set('token', token, { expires: 7, secure: true })
        return response.data
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Luôn xóa token khỏi cookie kể cả khi API lỗi
            Cookies.remove('token')
        }
    },

    async verifyEmail(token: string): Promise<void> {
        await api.post('/auth/verify-email', { token })
    },

    async resendVerificationEmail(email: string): Promise<void> {
        await api.post('/auth/resend-verification', { email })
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email })
    },

    async resetPassword(token: string, password: string): Promise<void> {
        await api.post('/auth/reset-password', { token, password })
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await api.post('/auth/change-password', { oldPassword, newPassword })
    },

    getToken(): string | undefined {
        return Cookies.get('token')
    },

    isAuthenticated(): boolean {
        return !!this.getToken()
    },
} 