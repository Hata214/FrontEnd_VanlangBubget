import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './i18n'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

// Các route không cần xác thực
const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/about',
    '/features',
    '/contact',
    '/pricing',
    '/terms',
    '/privacy',
    '/cookies'
]

// Các route yêu cầu xác thực
const protectedRoutes = [
    '/dashboard',
    '/incomes',
    '/expenses',
    '/loans',
    '/profile',
    '/settings',
]

// Các route API không cần xác thực
const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
]

// Hàm để lấy ngôn ngữ ưu tiên từ headers
function getLocale(request: NextRequest): string {
    // Ưu tiên 1: Cookie đã được đặt
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    // Ưu tiên 2: Negotiator dựa trên Accept-Language header
    let headers = { 'accept-language': request.headers.get('accept-language') || '' };
    let languages = new Negotiator({ headers: headers as any }).languages();
    return match(languages, locales as unknown as string[], 'vi');
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Bỏ qua các route API và static files
    if (pathname.startsWith('/api/') ||
        pathname.includes('.') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // Lấy ngôn ngữ từ cookie hoặc header
    const locale = getLocale(request);

    // Kiểm tra xác thực cho các route bảo vệ
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute) {
        // Kiểm tra token xác thực
        const token = request.cookies.get('token')?.value;

        // Nếu không có token, chuyển hướng về trang login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            // Lưu trang đích để redirect sau khi đăng nhập
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Thiết lập/cập nhật cookie ngôn ngữ nếu cần
    const response = NextResponse.next();

    // Nếu cookie không tồn tại hoặc khác với ngôn ngữ đã xác định
    if (request.cookies.get('NEXT_LOCALE')?.value !== locale) {
        response.cookies.set('NEXT_LOCALE', locale, {
            maxAge: 60 * 60 * 24 * 365, // 1 năm
        });
    }

    return response;
}

// Cấu hình các route cần áp dụng middleware
export const config = {
    matcher: [
        // Match all pathnames except for
        // - static files (e.g. favicon, images)
        // - api routes
        '/((?!api|_next|.*\\..*).*)'
    ]
} 