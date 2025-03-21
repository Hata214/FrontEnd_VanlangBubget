'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { BackToHome } from '@/components/auth/BackToHome'
import { Mail, CheckCircle } from 'lucide-react'

interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterPage() {
    const t = useTranslations();
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isRegistered, setIsRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    const form = useForm<RegisterFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: RegisterFormData) => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp')
            setShowError(true)
            return
        }

        try {
            dispatch(setLoading(true))
            setShowError(false)
            const response = await authService.register({
                name: data.name,
                email: data.email,
                password: data.password,
            })

            // Lưu thông tin đăng ký thành công
            setIsRegistered(true)
            setRegisteredEmail(data.email)

            // Đặt thông tin người dùng vào redux store
            dispatch(setCredentials(response))

            // Không tự động chuyển hướng đến dashboard nữa
            // router.push('/dashboard')
        } catch (error: any) {
            console.error('Register error:', error)
            setErrorMessage(error.response?.data?.message || 'Đăng ký thất bại')
            setShowError(true)
            dispatch(setError(error.response?.data?.message || 'Đăng ký thất bại'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleResendVerification = async () => {
        if (!registeredEmail) return;

        try {
            dispatch(setLoading(true))
            await authService.resendVerificationEmail(registeredEmail);
            // Hiển thị thông báo thành công
            setErrorMessage('');
            setShowError(false);
        } catch (error: any) {
            console.error('Resend verification error:', error);
            setErrorMessage(error.response?.data?.message || 'Không thể gửi lại email xác thực');
            setShowError(true);
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Nếu đã đăng ký thành công, hiển thị màn hình xác nhận
    if (isRegistered) {
        return (
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle>{t('auth.accountCreated')}</CardTitle>
                        <CardDescription>
                            {t('auth.emailVerificationSent')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md flex items-start space-x-3">
                            <Mail className="h-6 w-6 text-blue-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-800">{t('auth.emailVerificationRequired')}</h3>
                                <p className="text-sm text-blue-600 mt-1">
                                    {t('auth.emailVerificationDescription')}
                                </p>
                                <div className="mt-2">
                                    <span className="text-sm font-medium">Email: </span>
                                    <span className="text-sm font-bold">{registeredEmail}</span>
                                </div>
                            </div>
                        </div>

                        {showError && (
                            <Alert variant="destructive">
                                {errorMessage}
                            </Alert>
                        )}

                        <div className="flex flex-col space-y-3">
                            <Button
                                onClick={() => router.push('/login')}
                                className="w-full"
                            >
                                {t('auth.continueToLogin')}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleResendVerification}
                                className="w-full"
                            >
                                {t('auth.resendEmailVerification')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle>{t('auth.register')}</CardTitle>
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
                                    {errorMessage}
                                </Alert>
                            )}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('auth.fullName')}</Label>
                                    <Input
                                        id="name"
                                        {...form.register('name', {
                                            required: 'Họ và tên là bắt buộc',
                                            minLength: {
                                                value: 2,
                                                message: 'Họ và tên phải có ít nhất 2 ký tự',
                                            },
                                        })}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('auth.email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...form.register('email', {
                                            required: 'Email là bắt buộc',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email không hợp lệ',
                                            },
                                        })}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">{t('auth.password')}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...form.register('password', {
                                            required: 'Mật khẩu là bắt buộc',
                                            minLength: {
                                                value: 6,
                                                message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                            },
                                        })}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...form.register('confirmPassword', {
                                            required: 'Xác nhận mật khẩu là bắt buộc',
                                            validate: (value: string) =>
                                                value === form.watch('password') ||
                                                'Mật khẩu xác nhận không khớp',
                                        })}
                                    />
                                    {form.formState.errors.confirmPassword && (
                                        <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                {t('auth.register')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        {t('auth.alreadyHaveAccount')}{' '}
                        <Link
                            href="/login"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {t('auth.login')}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
} 