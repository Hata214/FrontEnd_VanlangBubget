'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import MainLayout from '@/components/layout/MainLayout'
import { BarChart } from '@/components/charts/BarChart'
import { PieChart } from '@/components/charts/PieChart'
import { RecentTransactions } from '@/components/transactions/RecentTransactions'
import { fetchIncomes } from '@/redux/features/incomeSlice'
import { fetchExpenses } from '@/redux/features/expenseSlice'
import { fetchLoans } from '@/redux/features/loanSlice'

export default function DashboardPage() {
    const t = useTranslations();
    const dispatch = useAppDispatch()
    const { incomes, totalIncome, isLoading: incomeLoading } = useAppSelector((state) => state.income)
    const { expenses, totalExpense, isLoading: expenseLoading } = useAppSelector((state) => state.expense)
    const { loans, totalLoan, isLoading: loanLoading } = useAppSelector((state) => state.loan)

    const isLoading = incomeLoading || expenseLoading || loanLoading

    useEffect(() => {
        dispatch(fetchIncomes())
        dispatch(fetchExpenses())
        dispatch(fetchLoans())
    }, [dispatch])

    const balance = totalIncome - totalExpense

    const recentTransactions = useMemo(() => {
        const allTransactions = [
            ...incomes.map((income) => ({
                id: income.id,
                type: 'income' as const,
                amount: income.amount,
                description: income.description,
                category: income.category,
                date: income.date,
            })),
            ...expenses.map((expense) => ({
                id: expense.id,
                type: 'expense' as const,
                amount: expense.amount,
                description: expense.description,
                category: expense.category,
                date: expense.date,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return allTransactions.slice(0, 10)
    }, [incomes, expenses])

    const expensesByCategory = useMemo(() => {
        const categories = expenses.reduce((acc, expense) => {
            const category = expense.category
            acc[category] = (acc[category] || 0) + expense.amount
            return acc
        }, {} as Record<string, number>)

        return {
            labels: Object.keys(categories),
            datasets: [
                {
                    data: Object.values(categories),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                    borderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                    borderWidth: 1,
                },
            ],
        }
    }, [expenses])

    const monthlyData = useMemo(() => {
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            return d.toLocaleString('vi-VN', { month: 'long' })
        }).reverse()

        const monthlyIncomes = months.map((month) => {
            return incomes
                .filter((income) => {
                    const incomeMonth = new Date(income.date).toLocaleString('vi-VN', {
                        month: 'long',
                    })
                    return incomeMonth === month
                })
                .reduce((sum, income) => sum + income.amount, 0)
        })

        const monthlyExpenses = months.map((month) => {
            return expenses
                .filter((expense) => {
                    const expenseMonth = new Date(expense.date).toLocaleString('vi-VN', {
                        month: 'long',
                    })
                    return expenseMonth === month
                })
                .reduce((sum, expense) => sum + expense.amount, 0)
        })

        return {
            labels: months,
            datasets: [
                {
                    label: 'Thu nhập',
                    data: monthlyIncomes,
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1,
                },
                {
                    label: 'Chi tiêu',
                    data: monthlyExpenses,
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1,
                },
            ],
        }
    }, [incomes, expenses])

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loading size="lg" />
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">{t('dashboard.financialOverview')}</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.balance')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {formatCurrency(balance)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.totalIncome')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalIncome)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.totalExpense')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(totalExpense)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.monthlyIncomeExpense')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <BarChart data={monthlyData} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.expenseByCategory')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <PieChart data={expensesByCategory} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.recentTransactions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentTransactions transactions={recentTransactions} />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
} 