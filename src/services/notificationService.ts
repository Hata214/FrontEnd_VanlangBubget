import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface LoanNotification {
    id: string;
    loanId: string;
    type: 'DUE_DATE' | 'PAYMENT_DUE' | 'OVERDUE';
    message: string;
    isRead: boolean;
    createdAt: string;
}

const notificationService = {
    getAll: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async (notificationId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/notifications/${notificationId}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/notifications/read-all`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteNotification: async (notificationId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/notifications/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            throw error;
        }
    },

    // Kiểm tra và tạo thông báo cho các khoản vay sắp đến hạn
    checkLoanDueDates: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/notifications/check-loans`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default notificationService; 