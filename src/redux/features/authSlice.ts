import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import { authService } from '@/services/authService'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
}

// Định nghĩa kiểu AuthResponse từ authService
interface AuthResponse {
    user: {
        id: string
        email: string
        name: string
    }
    token: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    isLoading: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isLoading: false,
}

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: { firstName: string; lastName: string; phoneNumber?: string }) => {
        const response = await api.put('/auth/profile', data)
        return response.data
    }
)

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data: { currentPassword: string; newPassword: string }) => {
        await authService.changePassword(data.currentPassword, data.newPassword)
        return true
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<AuthResponse>
        ) => {
            // Chuyển đổi từ AuthResponse.user sang User
            const { name } = action.payload.user;
            const nameParts = name.split(' ');
            const lastName = nameParts.pop() || '';
            const firstName = nameParts.join(' ');

            state.user = {
                id: action.payload.user.id,
                email: action.payload.user.email,
                firstName,
                lastName,
                phoneNumber: ''
            }
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Có lỗi xảy ra'
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Đổi mật khẩu thất bại'
            })
    },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer 