'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addIncome, updateIncome, deleteIncome, fetchIncomes, fetchCategories } from '@/redux/features/incomeSlice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { IncomeForm, type IncomeFormData } from '@/components/incomes/IncomeForm'
import { IncomeList } from '@/components/incomes/IncomeList'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { Income } from '@/types'
import MainLayout from '@/components/layout/MainLayout'

export default function IncomesPage() {
    const t = useTranslations();
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { incomes, categories, totalIncome, isLoading, error } = useAppSelector((state) => state.income)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        dispatch(fetchIncomes())
        dispatch(fetchCategories())
    }, [dispatch])

    const handleAdd = async (data: IncomeFormData) => {
        setIsSubmitting(true)
        try {
            await dispatch(addIncome(data)).unwrap()
            setIsAddModalOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Add error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (id: string, data: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        try {
            await dispatch(updateIncome({ id, ...data })).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Edit error:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteIncome(id)).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{t('income.manage')}</h1>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('income.add')}
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
                            {t('income.total')}
                        </div>
                        <div className="mt-2 text-3xl font-bold text-green-600">
                            {formatCurrency(totalIncome)}
                        </div>
                    </Card>
                </div>

                <Card>
                    <IncomeList
                        incomes={incomes}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title={t('income.add')}
                >
                    <IncomeForm
                        onSubmit={handleAdd}
                        isSubmitting={isSubmitting}
                    />
                </Modal>
            </div>
        </MainLayout>
    )
} 