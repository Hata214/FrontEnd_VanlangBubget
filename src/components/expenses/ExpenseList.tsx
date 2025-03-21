'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { SearchFilter, type FilterOptions } from '@/components/common/SearchFilter'
import { Pagination } from '@/components/common/Pagination'
import { ExpenseForm } from './ExpenseForm'
import type { ExpenseFormData } from './ExpenseForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2, MapPin } from 'lucide-react'
import type { Expense } from '@/types'
import type { ReactNode } from 'react'
import { useAppSelector } from '@/redux/hooks'

interface Location {
    lat: number
    lng: number
    address: string
}

interface ExpenseListProps {
    expenses: Expense[]
    isLoading?: boolean
    onEdit: (id: string, data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
}

const EXPENSE_CATEGORIES = [
    'Ăn uống',
    'Di chuyển',
    'Mua sắm',
    'Giải trí',
    'Hóa đơn',
    'Sức khỏe',
    'Giáo dục',
    'Khác',
    // Các danh mục tùy chỉnh sẽ được hiển thị từ API
]

export function ExpenseList({ expenses, isLoading, onEdit, onDelete }: ExpenseListProps) {
    const t = useTranslations();
    const { categories } = useAppSelector((state) => state.expense);
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<FilterOptions>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showLocationModal, setShowLocationModal] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Danh sách danh mục từ Redux hoặc sử dụng danh mục mặc định
    const expenseCategories = useMemo(() => {
        // Chuyển đổi danh mục từ Redux sang định dạng cần thiết cho SearchFilter
        if (categories && categories.length > 0) {
            return [...EXPENSE_CATEGORIES, ...categories.filter((cat: string) =>
                !EXPENSE_CATEGORIES.includes(cat) && cat !== 'Khác'
            )];
        }
        return EXPENSE_CATEGORIES;
    }, [categories]);

    // Lọc và tìm kiếm
    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            // Tìm kiếm theo mô tả
            if (searchTerm && !expense.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            // Lọc theo danh mục
            if (filters.category && expense.category !== filters.category) {
                return false
            }

            // Lọc theo khoảng thời gian
            if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) {
                return false
            }
            if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) {
                return false
            }

            // Lọc theo khoảng tiền
            if (filters.minAmount && expense.amount < filters.minAmount) {
                return false
            }
            if (filters.maxAmount && expense.amount > filters.maxAmount) {
                return false
            }

            return true
        })
    }, [expenses, searchTerm, filters])

    // Phân trang
    const paginatedExpenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredExpenses.slice(startIndex, endIndex)
    }, [filteredExpenses, currentPage, itemsPerPage])

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

    const handlePageSizeChange = (size: number) => {
        setItemsPerPage(size)
        setCurrentPage(1)
    }

    const handleEdit = async (expense: Expense) => {
        setSelectedExpense(expense)
        setIsEditModalOpen(true)
    }

    const handleDelete = async (expense: Expense) => {
        setSelectedExpense(expense)
        setIsDeleteModalOpen(true)
    }

    const handleEditSubmit = async (data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!selectedExpense) return
        setIsSubmitting(true)
        try {
            await onEdit(selectedExpense.id, data)
            setIsEditModalOpen(false)
        } catch (error) {
            console.error('Edit error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteSubmit = async () => {
        if (!selectedExpense) return
        setIsSubmitting(true)
        try {
            await onDelete(selectedExpense.id)
            setIsDeleteModalOpen(false)
        } catch (error) {
            console.error('Delete error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns: Column<Expense>[] = [
        {
            header: t('common.date'),
            accessor: (expense: Expense) => formatDate(expense.date),
            className: 'w-32',
        },
        {
            header: t('common.category'),
            accessor: 'category' as const,
            className: 'w-32',
        },
        {
            header: t('common.description'),
            accessor: 'description' as const,
        },
        {
            header: t('common.location'),
            accessor: (expense: Expense) => (
                expense.location ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => {
                            setSelectedExpense(expense)
                            setShowLocationModal(true)
                        }}
                    >
                        <MapPin className="w-4 h-4 mr-1" />
                        {expense.location.address}
                    </Button>
                ) : null
            ),
            className: 'w-48',
        },
        {
            header: t('common.amount'),
            accessor: (expense: Expense) => (
                <span className="text-red-600">{formatCurrency(expense.amount)}</span>
            ),
            className: 'w-32 text-right',
        },
        {
            header: t('common.actions'),
            accessor: (expense: Expense) => (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(expense)
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(expense)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
            className: 'w-24',
        },
    ]

    return (
        <div className="space-y-4">
            <SearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onReset={handleReset}
                categories={expenseCategories}
            />

            <Table
                data={paginatedExpenses}
                columns={columns}
                isLoading={isLoading}
                emptyMessage={t('expense.noExpense')}
            />

            <Pagination
                totalItems={filteredExpenses.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handlePageSizeChange}
            />

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={t('expense.edit')}
            >
                {selectedExpense && (
                    <ExpenseForm
                        initialData={selectedExpense}
                        onSubmit={handleEditSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={t('expense.delete')}
            >
                <Alert
                    variant="destructive"
                    className="mb-4"
                >
                    <AlertDescription>
                        {t('expense.deleteConfirm')}
                    </AlertDescription>
                </Alert>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteSubmit}
                        isLoading={isSubmitting}
                    >
                        {t('expense.delete')}
                    </Button>
                </div>
            </Modal>

            {selectedExpense?.location && (
                <Modal
                    isOpen={showLocationModal}
                    onClose={() => setShowLocationModal(false)}
                    title={t('expense.location')}
                >
                    <div className="space-y-4">
                        <div className="h-64 bg-gray-100 rounded-lg">
                            {/* TODO: Implement Google Maps */}
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Bản đồ đang được cập nhật...</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {selectedExpense.location.address}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    )
} 