'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { SearchFilter, type FilterOptions } from '@/components/common/SearchFilter'
import { Pagination } from '@/components/common/Pagination'
import { LoanForm } from './LoanForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import type { Loan } from '@/types'
import type { ReactNode } from 'react'

interface LoanListProps {
    loans: Loan[]
    isLoading?: boolean
    onEdit: (id: string, data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onRowClick?: (loan: Loan) => void
}

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
}

const LOAN_LENDERS = [
    'Cá nhân',
    'Ngân hàng',
    'Tín dụng',
    'Khác',
]

export function LoanList({ loans, isLoading, onEdit, onDelete, onRowClick }: LoanListProps) {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<FilterOptions>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredLoans = useMemo(() => {
        return loans.filter((loan) => {
            // Tìm kiếm theo mô tả
            if (searchTerm && !loan.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            // Lọc theo người cho vay (thay vì danh mục)
            if (filters.category && loan.lender !== filters.category) {
                return false
            }

            // Lọc theo khoảng thời gian
            if (filters.startDate && new Date(loan.startDate) < new Date(filters.startDate)) {
                return false
            }
            if (filters.endDate && new Date(loan.dueDate) > new Date(filters.endDate)) {
                return false
            }

            // Lọc theo khoảng tiền
            if (filters.minAmount && loan.amount < filters.minAmount) {
                return false
            }
            if (filters.maxAmount && loan.amount > filters.maxAmount) {
                return false
            }

            return true
        })
    }, [loans, searchTerm, filters])

    // Phân trang
    const paginatedLoans = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredLoans.slice(startIndex, endIndex)
    }, [filteredLoans, currentPage, itemsPerPage])

    const getStatusColor = (status: Loan['status']) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-blue-100 text-blue-800'
            case 'PAID':
                return 'bg-green-100 text-green-800'
            case 'OVERDUE':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: Loan['status']) => {
        switch (status) {
            case 'ACTIVE':
                return t('loan.active')
            case 'PAID':
                return t('loan.paid')
            case 'OVERDUE':
                return t('loan.overdue')
            default:
                return 'Không xác định'
        }
    }

    const columns: Column<Loan>[] = [
        {
            header: t('loan.startDate'),
            accessor: (loan: Loan) => formatDate(loan.startDate),
            className: 'w-32',
        },
        {
            header: t('loan.lender'),
            accessor: 'lender' as const,
            className: 'w-32',
        },
        {
            header: t('common.description'),
            accessor: 'description' as const,
        },
        {
            header: t('common.amount'),
            accessor: (loan: Loan) => (
                <span className="text-red-600">{formatCurrency(loan.amount)}</span>
            ),
            className: 'w-32 text-right',
        },
        {
            header: t('loan.interestRate'),
            accessor: (loan: Loan) => `${loan.interestRate}%`,
            className: 'w-24 text-right',
        },
        {
            header: t('loan.dueDate'),
            accessor: (loan: Loan) => formatDate(loan.dueDate),
            className: 'w-32',
        },
        {
            header: t('loan.status'),
            accessor: (loan: Loan) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                    {getStatusText(loan.status)}
                </span>
            ),
            className: 'w-24',
        },
        {
            header: t('common.actions'),
            accessor: (loan: Loan) => (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLoan(loan)
                            setShowEditModal(true)
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLoan(loan)
                            setShowDeleteModal(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
            className: 'w-24',
        },
    ]

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handleFilter = (newFilters: FilterOptions) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handleReset = () => {
        setSearchTerm('')
        setFilters({})
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (size: number) => {
        setItemsPerPage(size)
        setCurrentPage(1)
    }

    const handleEditSubmit = async (data: Omit<Loan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!selectedLoan) return
        setIsSubmitting(true)
        try {
            await onEdit(selectedLoan.id, data)
            setShowEditModal(false)
            setSelectedLoan(null)
        } catch (error) {
            console.error('Edit error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedLoan) return
        setIsSubmitting(true)
        try {
            await onDelete(selectedLoan.id)
            setShowDeleteModal(false)
            setSelectedLoan(null)
        } catch (error) {
            console.error('Delete error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <SearchFilter
                categories={LOAN_LENDERS}
                onSearch={handleSearch}
                onFilter={handleFilter}
                onReset={handleReset}
                categoryLabel="loan.lender"
            />

            <Table
                data={paginatedLoans}
                columns={columns}
                isLoading={isLoading}
                onRowClick={onRowClick}
                emptyMessage={t('loan.noLoan')}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={filteredLoans.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedLoan(null)
                }}
                title={t('loan.edit')}
            >
                {selectedLoan && (
                    <LoanForm
                        initialData={{
                            amount: selectedLoan.amount,
                            description: selectedLoan.description,
                            lender: selectedLoan.lender,
                            interestRate: selectedLoan.interestRate,
                            startDate: selectedLoan.startDate,
                            dueDate: selectedLoan.dueDate,
                        }}
                        onSubmit={handleEditSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSelectedLoan(null)
                }}
                title={t('loan.delete')}
            >
                <Alert
                    variant="destructive"
                    className="mb-4"
                >
                    <AlertDescription>
                        {t('loan.deleteConfirm')}
                    </AlertDescription>
                </Alert>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowDeleteModal(false)
                            setSelectedLoan(null)
                        }}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        isLoading={isSubmitting}
                    >
                        {t('loan.delete')}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}