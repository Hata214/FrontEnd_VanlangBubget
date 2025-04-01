import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();

    // Kiểm tra xem có phải tài khoản demo không
    const isDemoAccount = user?.email === "demo@example.com";

    useEffect(() => {
        // Nếu không đang loading và chưa xác thực và không phải tài khoản demo
        if (!loading && !isAuthenticated && !isDemoAccount) {
            router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }, [loading, isAuthenticated, isDemoAccount, router, pathname]);

    // Hiển thị loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Nếu đang kiểm tra xác thực, hiển thị null để tránh flash của nội dung
    if (!isAuthenticated && !isDemoAccount) {
        return null;
    }

    // Cho phép truy cập nếu đã xác thực hoặc là tài khoản demo
    return <>{children}</>;
};

export default ProtectedRoute; 