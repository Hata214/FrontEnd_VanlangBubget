'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateLoan, deleteLoan } from '@/redux/features/loanSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'
import { LoanForm } from '@/components/loans/LoanForm'
import { LoanPaymentList } from '@/components/loans/LoanPaymentList'
import { LoanStatistics } from '@/components/loans/LoanStatistics'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import type { Loan, LoanPayment } from '@/types'
import { loanService } from '@/services/loanService'

export default function LoanDetailPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { selectedLoan: loan, isLoading, error } = useAppSelector((state) => state.loan)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleUpdateLoan = async (data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!loan) return
        setIsSubmitting(true)
        try {
            await dispatch(updateLoan({ id: loan.id, data })).unwrap()
            setShowEditModal(false)
            router.refresh()
        } catch (error) {
            console.error('Update loan error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteLoan = async () => {
        if (!loan) return
        setIsSubmitting(true)
        try {
            await dispatch(deleteLoan(loan.id)).unwrap()
            router.push('/loans')
        } catch (error) {
            console.error('Delete loan error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddPayment = async (formData: FormData) => {
        if (!loan) return
        setIsSubmitting(true)
        try {
            const data: Omit<LoanPayment, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
                loanId: loan.id,
                amount: Number(formData.get('amount')),
                paymentDate: formData.get('paymentDate') as string,
                description: formData.get('description') as string,
            }

            const files = formData.getAll('attachments') as File[]
            if (files.length > 0) {
                const attachmentUrls = await loanService.uploadPaymentAttachments(loan.id, '', files)
                data.attachments = attachmentUrls
            }

            await loanService.createPayment(loan.id, data)
            router.refresh()
        } catch (error) {
            console.error('Add payment error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditPayment = async (paymentId: string, formData: FormData) => {
        if (!loan) return
        setIsSubmitting(true)
        try {
            const data: Partial<Omit<LoanPayment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> = {
                amount: Number(formData.get('amount')),
                paymentDate: formData.get('paymentDate') as string,
                description: formData.get('description') as string,
            }

            const files = formData.getAll('attachments') as File[]
            if (files.length > 0) {
                const attachmentUrls = await loanService.uploadPaymentAttachments(loan.id, paymentId, files)
                data.attachments = attachmentUrls
            }

            await loanService.updatePayment(loan.id, paymentId, data)
            router.refresh()
        } catch (error) {
            console.error('Edit payment error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeletePayment = async (paymentId: string) => {
        if (!loan) return
        setIsSubmitting(true)
        try {
            await loanService.deletePayment(loan.id, paymentId)
            router.refresh()
        } catch (error) {
            console.error('Delete payment error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!loan) {
        return null
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Chi tiết khoản vay</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowEditModal(true)}
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                    </Button>
                </div>
            </div>

            {error && (
                <Alert
                    variant="error"
                    message={error}
                />
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin khoản vay</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Số tiền vay
                                </dt>
                                <dd className="mt-1 text-lg font-semibold">
                                    {formatCurrency(loan.amount)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Người cho vay
                                </dt>
                                <dd className="mt-1">{loan.lender}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Lãi suất
                                </dt>
                                <dd className="mt-1">{loan.interestRate}%</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Ngày vay
                                </dt>
                                <dd className="mt-1">{formatDate(loan.startDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Ngày đáo hạn
                                </dt>
                                <dd className="mt-1">{formatDate(loan.dueDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">
                                    Trạng thái
                                </dt>
                                <dd className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${loan.status === 'ACTIVE'
                                            ? 'bg-blue-100 text-blue-800'
                                            : loan.status === 'PAID'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {loan.status === 'ACTIVE'
                                            ? 'Đang vay'
                                            : loan.status === 'PAID'
                                                ? 'Đã trả'
                                                : 'Quá hạn'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                        {loan.description && (
                            <div className="mt-4">
                                <dt className="text-sm font-medium text-gray-500">
                                    Ghi chú
                                </dt>
                                <dd className="mt-1">{loan.description}</dd>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoanStatistics loans={[loan]} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent>
                    <LoanPaymentList
                        loanId={loan.id}
                        loanAmount={loan.amount}
                        payments={loan.payments || []}
                        isLoading={isLoading}
                        onAddPayment={handleAddPayment}
                        onEditPayment={handleEditPayment}
                        onDeletePayment={handleDeletePayment}
                    />
                </CardContent>
            </Card>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Chỉnh sửa khoản vay"
            >
                <LoanForm
                    initialData={{
                        amount: loan.amount,
                        lender: loan.lender,
                        interestRate: loan.interestRate,
                        startDate: loan.startDate,
                        dueDate: loan.dueDate,
                        description: loan.description,
                    }}
                    onSubmit={handleUpdateLoan}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xóa khoản vay"
            >
                <Alert variant="destructive">
                    <AlertTitle>Bạn có chắc chắn muốn xóa khoản vay này?</AlertTitle>
                    <AlertDescription>
                        Tất cả thông tin về khoản vay và lịch sử trả sẽ bị xóa. Hành động này không thể hoàn tác.
                    </AlertDescription>
                </Alert>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteLoan}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </div>
            </Modal>
        </div>
    )
} 