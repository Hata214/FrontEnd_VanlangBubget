import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    // Kiểm tra xem có phải tài khoản demo không
    const isDemoAccount = user?.email === "demo@example.com";

    // Hiển thị loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Cho phép truy cập nếu đã xác thực hoặc là tài khoản demo
    if (isAuthenticated || isDemoAccount) {
        return <>{children}</>;
    }

    // Chuyển hướng về trang login nếu chưa xác thực
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute; 