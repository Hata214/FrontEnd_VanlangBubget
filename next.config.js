/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
    // Thêm cấu hình next-intl
    './src/i18n.ts'
);

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', process.env.NEXT_PUBLIC_API_DOMAIN || 'api-domain.com'],
    },
    env: {
        API_URL: process.env.API_URL || 'http://localhost:3001',
    },
    // Tắt kiểm tra TypeScript khi build
    typescript: {
        ignoreBuildErrors: true,
    },
    // Tắt kiểm tra ESLint khi build
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        const API_URL = process.env.API_URL || 'http://localhost:3001';
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/api/:path*`
            }
        ]
    }
}

module.exports = withNextIntl(nextConfig)