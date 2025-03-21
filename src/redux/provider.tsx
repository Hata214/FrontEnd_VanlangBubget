'use client'

import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { useEffect } from 'react'
import { setCredentials } from './features/authSlice'
import { authService } from '@/services/authService'
import api from '@/services/api'

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Kiểm tra token trong cookie và khôi phục trạng thái đăng nhập
        const initializeAuth = async () => {
            try {
                const token = authService.getToken();

                if (token) {
                    // Gọi API lấy thông tin người dùng từ token
                    const response = await api.get('/auth/me');

                    if (response.data) {
                        // Thiết lập thông tin đăng nhập trong Redux store
                        store.dispatch(setCredentials({
                            user: response.data,
                            token
                        }));
                    }
                }
            } catch (error) {
                console.error('Lỗi khi khôi phục trạng thái đăng nhập:', error);
                // Nếu có lỗi, xóa token
                authService.logout();
            }
        };

        initializeAuth();
    }, []);

    return <Provider store={store}>{children}</Provider>
} 