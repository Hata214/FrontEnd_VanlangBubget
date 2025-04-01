'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import {
    HomeIcon,
    BanknotesIcon,
    CreditCardIcon,
    DocumentChartBarIcon,
    UserCircleIcon,
    ArrowLeftOnRectangleIcon,
    XMarkIcon,
    Bars3Icon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'
import { authService } from '@/services/authService'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Button } from '@/components/ui/Button'

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname() || '';
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Cấu hình thông tin điều hướng từ các file dịch
    const navigation = [
        { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
        { name: t('navigation.incomes'), href: '/incomes', icon: BanknotesIcon },
        { name: t('navigation.expenses'), href: '/expenses', icon: CreditCardIcon },
        { name: t('navigation.loans'), href: '/loans', icon: DocumentChartBarIcon },
    ]

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            // Gọi API đăng xuất
            await authService.logout()
            // Cập nhật state Redux
            dispatch(logout())
            // Chuyển hướng về trang đăng nhập
            router.push('/login')
        } catch (error) {
            console.error('Đăng xuất thất bại:', error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div className="flex items-center justify-between h-16 px-4 bg-primary">
                        <div className="flex items-center">
                            <Image
                                src="/logo-vlb.png"
                                alt="VangLang Budget Logo"
                                width={32}
                                height={32}
                            />
                            <h1 className="ml-2 text-xl font-bold text-primary-foreground">{t('app.name')}</h1>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname.includes(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Menu - Gom vào một chỗ */}
                    <div className="flex-shrink-0 p-4 border-t border-border">
                        <div className="flex flex-col space-y-4">
                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-md">
                                <span className="text-sm font-medium">{t('settings.theme.label')}</span>
                                <ThemeToggle />
                            </div>

                            {/* Language Toggle */}
                            <div className="px-4 py-2 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{t('settings.language.label')}</span>
                                    <LanguageToggle variant="icon" />
                                </div>
                                <LanguageToggle className="w-full" />
                            </div>

                            {/* Profile Menu - Dropdown */}
                            <div className="mt-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full flex items-center justify-between">
                                            <div className="flex items-center">
                                                <UserCircleIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                                                <span>{t('profile.account')}</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6" /></svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>{t('profile.account')}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center cursor-pointer">
                                                <UserCircleIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                                {t('userProfile.title')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center cursor-pointer">
                                                <Cog6ToothIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                                {t('settings.title')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            disabled={isLoggingOut}
                                            onClick={handleLogout}
                                            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                                        >
                                            <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                                            {isLoggingOut ? t('profile.loggingOut') : t('profile.logout')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`transition-margin duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                {/* Header with menu button when sidebar is closed */}
                {!isSidebarOpen && (
                    <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-card shadow-sm">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 mr-2 text-foreground rounded-md hover:bg-muted focus:outline-none"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <div className="flex items-center">
                                <Image
                                    src="/logo-vlb.png"
                                    alt="VangLang Budget Logo"
                                    width={24}
                                    height={24}
                                />
                                <h1 className="ml-2 text-lg font-semibold text-foreground">{t('app.name')}</h1>
                            </div>
                        </div>

                        {/* Các điều khiển ở header */}
                        <div className="flex items-center space-x-3">
                            <LanguageToggle variant="icon" />
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <UserCircleIcon className="h-6 w-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t('profile.account')}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center cursor-pointer">
                                            <UserCircleIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                            {t('userProfile.title')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center cursor-pointer">
                                            <Cog6ToothIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                            {t('settings.title')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        disabled={isLoggingOut}
                                        onClick={handleLogout}
                                        className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                                        {isLoggingOut ? t('profile.loggingOut') : t('profile.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </div>
    )
} 