'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials, setLoading, setError } from '@/redux/features/authSlice'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Form } from '@/components/ui/Form'
import { Alert } from '@/components/ui/Alert'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { setIncomes, setTotalIncome } from '@/redux/features/incomeSlice'
import { setExpenses, setTotalExpense } from '@/redux/features/expenseSlice'
import { setLoans, setTotalLoan } from '@/redux/features/loanSlice'
import { Income, Expense, Loan } from '@/types'
import { BackToHome } from '@/components/auth/BackToHome'
import Cookies from 'js-cookie'

interface LoginFormData {
    email: string
    password: string
}

export default function LoginPage() {
    const t = useTranslations();
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectUrl = searchParams?.get('redirect') || '/dashboard'
    const dispatch = useAppDispatch()
    const [showError, setShowError] = useState(false)

    const form = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            dispatch(setLoading(true))
            setShowError(false)
            const response = await authService.login(data)
            dispatch(setCredentials(response))
            router.push(redirectUrl)
        } catch (error) {
            console.error('Login error:', error)
            dispatch(setError('Email hoặc mật khẩu không chính xác'))
            setShowError(true)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const loginWithDemo = () => {
        // Tạo dữ liệu người dùng demo
        const demoUser = {
            user: {
                id: 'demo-user-id',
                email: 'demo@vanlangbudget.com',
                name: 'Demo User',
            },
            token: 'demo-token-123456789'
        }

        // Lưu token demo vào cookie
        Cookies.set('token', demoUser.token, { expires: 1 })

        // Đăng nhập với tài khoản demo
        dispatch(setCredentials(demoUser))

        // Tạo dữ liệu thu nhập mẫu
        const currentDate = new Date().toISOString()
        const demoIncomes: Income[] = [
            {
                id: 'income-1',
                amount: 15000000,
                description: 'Lương tháng 3',
                category: 'Lương',
                date: '2023-03-25',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'income-2',
                amount: 5000000,
                description: 'Thưởng dự án',
                category: 'Thưởng',
                date: '2023-03-28',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'income-3',
                amount: 15000000,
                description: 'Lương tháng 2',
                category: 'Lương',
                date: '2023-02-25',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'income-4',
                amount: 15000000,
                description: 'Lương tháng 1',
                category: 'Lương',
                date: '2023-01-25',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'income-5',
                amount: 3000000,
                description: 'Freelance',
                category: 'Khác',
                date: '2023-01-15',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ]

        // Tạo dữ liệu chi tiêu mẫu
        const demoExpenses: Expense[] = [
            {
                id: 'expense-1',
                amount: 5000000,
                description: 'Tiền nhà tháng 3',
                category: 'Nhà cửa',
                date: '2023-03-05',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'expense-2',
                amount: 2000000,
                description: 'Tiền điện nước tháng 3',
                category: 'Hóa đơn',
                date: '2023-03-10',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'expense-3',
                amount: 3000000,
                description: 'Đi chợ',
                category: 'Thực phẩm',
                date: '2023-03-15',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'expense-4',
                amount: 1500000,
                description: 'Xăng xe',
                category: 'Đi lại',
                date: '2023-03-20',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'expense-5',
                amount: 5000000,
                description: 'Tiền nhà tháng 2',
                category: 'Nhà cửa',
                date: '2023-02-05',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'expense-6',
                amount: 2000000,
                description: 'Tiền điện nước tháng 2',
                category: 'Hóa đơn',
                date: '2023-02-10',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ]

        // Tạo dữ liệu khoản vay mẫu
        const demoLoans: Loan[] = [
            {
                id: 'loan-1',
                amount: 50000000,
                description: 'Vay mua xe',
                lender: 'Ngân hàng A',
                interestRate: 8,
                startDate: '2023-01-01',
                dueDate: '2024-01-01',
                status: 'ACTIVE',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            },
            {
                id: 'loan-2',
                amount: 10000000,
                description: 'Vay tiêu dùng',
                lender: 'Ngân hàng B',
                interestRate: 10,
                startDate: '2023-02-01',
                dueDate: '2023-08-01',
                status: 'ACTIVE',
                userId: 'demo-user-id',
                createdAt: currentDate,
                updatedAt: currentDate
            }
        ]

        // Cập nhật dữ liệu vào Redux store
        dispatch(setIncomes(demoIncomes))
        dispatch(setTotalIncome(demoIncomes.reduce((sum, income) => sum + income.amount, 0)))

        dispatch(setExpenses(demoExpenses))
        dispatch(setTotalExpense(demoExpenses.reduce((sum, expense) => sum + expense.amount, 0)))

        dispatch(setLoans(demoLoans))
        dispatch(setTotalLoan(demoLoans.reduce((sum, loan) => sum + loan.amount, 0)))

        // Chuyển hướng đến trang sau khi đăng nhập
        router.push(redirectUrl)
    }

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle>{t('auth.login')}</CardTitle>
                    <CardDescription>
                        {t('app.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BackToHome />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {showError && (
                                <Alert variant="destructive">
                                    {t('auth.loginError')}
                                </Alert>
                            )}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('auth.email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        {...form.register('email', { required: true })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t('auth.password')}</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                        >
                                            {t('auth.forgotPassword')}
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...form.register('password', { required: true })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button type="submit" className="w-full">
                                    {t('auth.login')}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={loginWithDemo}
                                >
                                    {t('auth.demoAccount')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        {t('auth.dontHaveAccount')}{' '}
                        <Link
                            href="/register"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {t('auth.register')}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
} 