import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import ClientWrapper from '@/components/layout/ClientWrapper'
import { locales } from '@/i18n'
import { NextIntlClientProvider } from 'next-intl'

// Import message cho từng locale
const getMessages = async (locale: string) => {
    return (await import(`../../messages/${locale}.json`)).default;
};

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        template: '%s | VangLang Budget',
        default: 'VangLang Budget',
    },
    description: 'Ứng dụng quản lý tài chính cá nhân',
    keywords: ['quản lý tài chính', 'chi tiêu', 'thu nhập', 'ngân sách', 'khoản vay'],
    authors: [{ name: 'VangLang Budget Team' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    icons: [
        { rel: 'icon', url: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ]
}

// Tạo các đường dẫn tĩnh cho mỗi locale
export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode,
    params: { locale: string }
}) {
    const messages = await getMessages(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ClientWrapper>
                        {children}
                    </ClientWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    )
} 