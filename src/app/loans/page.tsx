'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addLoan, updateLoan, deleteLoan, fetchLoans } from '@/redux/features/loanSlice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoanForm } from '@/components/loans/LoanForm'
import { LoanList } from '@/components/loans/LoanList'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import type { Loan } from '@/types'
import MainLayout from '@/components/layout/MainLayout'

export default function LoansPage() {
    const t = useTranslations();
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loans, totalLoan, isLoading, error } = useAppSelector((state) => state.loan)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        dispatch(fetchLoans())
    }, [dispatch])

    const handleAdd = async (data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        setIsSubmitting(true)
        try {
            await dispatch(addLoan(data)).unwrap()
            setIsAddModalOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Add error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (id: string, data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        try {
            await dispatch(updateLoan({ id, data })).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Edit error:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteLoan(id)).unwrap()
            router.refresh()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{t('loan.manage')}</h1>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('loan.add')}
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
                            {t('loan.totalDebt')}
                        </div>
                        <div className="mt-2 text-3xl font-bold text-red-600">
                            {formatCurrency(totalLoan)}
                        </div>
                    </Card>
                </div>

                <Card>
                    <LoanList
                        loans={loans}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title={t('loan.add')}
                >
                    <LoanForm
                        onSubmit={handleAdd}
                        isSubmitting={isSubmitting}
                    />
                </Modal>
            </div>
        </MainLayout>
    )
} 