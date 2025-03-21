'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addExpense, updateExpense, deleteExpense, fetchExpenses, fetchCategories } from '@/redux/features/expenseSlice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { ExpenseForm, type ExpenseFormData } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { Expense } from '@/types'
import MainLayout from '@/components/layout/MainLayout'

export default function ExpensesPage() {
    const t = useTranslations();
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { expenses, categories, totalExpense, isLoading, error } = useAppSelector((state) => state.expense)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        dispatch(fetchExpenses())
        dispatch(fetchCategories())
    }, [dispatch])

    const handleAdd = async (data: ExpenseFormData) => {
        setIsSubmitting(true)
        try {
            await dispatch(addExpense(data)).unwrap()
            setIsAddModalOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Add error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (id: string, data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        try {
            await dispatch(updateExpense({ id, ...data })).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Edit error:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteExpense(id)).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{t('expense.manage')}</h1>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('expense.add')}
                    </Button>
                </div>

                {error && (
                    <Alert
                        variant="error"
                        message={error}
                    />
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-6">
                        <div className="text-sm font-medium text-gray-500">
                            {t('expense.total')}
                        </div>
                        <div className="mt-2 text-3xl font-bold text-red-600">
                            {formatCurrency(totalExpense)}
                        </div>
                    </Card>
                </div>

                <Card>
                    <ExpenseList
                        expenses={expenses}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title={t('expense.add')}
                >
                    <ExpenseForm
                        onSubmit={handleAdd}
                        isSubmitting={isSubmitting}
                    />
                </Modal>
            </div>
        </MainLayout>
    )
} 