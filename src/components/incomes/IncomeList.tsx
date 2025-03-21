'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { SearchFilter, type FilterOptions } from '@/components/common/SearchFilter'
import { Pagination } from '@/components/common/Pagination'
import { IncomeForm } from './IncomeForm'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import type { Income } from '@/types'
import type { ReactNode } from 'react'
import { useAppSelector } from '@/redux/hooks'

interface IncomeListProps {
    incomes: Income[]
    isLoading?: boolean
    onEdit: (id: string, data: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
}

const INCOME_CATEGORIES = [
    'Lương',
    'Thưởng',
    'Đầu tư',
    'Kinh doanh',
    'Khác',
    // Các danh mục tùy chỉnh sẽ được hiển thị từ API
]

export function IncomeList({ incomes, isLoading, onEdit, onDelete }: IncomeListProps) {
    const t = useTranslations();
    const { categories } = useAppSelector((state) => state.income);
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<FilterOptions>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Danh sách danh mục từ Redux hoặc sử dụng danh mục mặc định
    const incomeCategories = useMemo(() => {
        // Chuyển đổi danh mục từ Redux sang định dạng cần thiết cho SearchFilter
        if (categories && categories.length > 0) {
            return [...INCOME_CATEGORIES, ...categories.filter((cat: string) =>
                !INCOME_CATEGORIES.includes(cat) && cat !== 'Khác'
            )];
        }
        return INCOME_CATEGORIES;
    }, [categories]);

    const filteredIncomes = useMemo(() => {
        return incomes.filter((income) => {
            // Tìm kiếm theo mô tả
            if (searchTerm && !income.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false
            }

            // Lọc theo danh mục
            if (filters.category && income.category !== filters.category) {
                return false
            }

            // Lọc theo khoảng thời gian
            if (filters.startDate && new Date(income.date) < new Date(filters.startDate)) {
                return false
            }
            if (filters.endDate && new Date(income.date) > new Date(filters.endDate)) {
                return false
            }

            // Lọc theo khoảng tiền
            if (filters.minAmount && income.amount < filters.minAmount) {
                return false
            }
            if (filters.maxAmount && income.amount > filters.maxAmount) {
                return false
            }

            return true
        })
    }, [incomes, searchTerm, filters])

    // Phân trang
    const paginatedIncomes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredIncomes.slice(startIndex, endIndex)
    }, [filteredIncomes, currentPage, itemsPerPage])

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

    const handleEdit = (income: Income) => {
        setSelectedIncome(income)
        setShowEditModal(true)
    }

    const handleDelete = async () => {
        if (!selectedIncome) return
        setIsSubmitting(true)
        try {
            await onDelete(selectedIncome.id)
            setShowDeleteModal(false)
            setSelectedIncome(null)
        } catch (error) {
            console.error('Delete error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditSubmit = async (data: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!selectedIncome) return
        setIsSubmitting(true)
        try {
            await onEdit(selectedIncome.id, data)
            setShowEditModal(false)
            setSelectedIncome(null)
        } catch (error) {
            console.error('Edit error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns: Column<Income>[] = [
        {
            header: t('common.date'),
            accessor: (income: Income) => formatDate(income.date),
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
            header: t('common.amount'),
            accessor: (income: Income) => (
                <span className="text-green-600">{formatCurrency(income.amount)}</span>
            ),
            className: 'w-32 text-right',
        },
        {
            header: t('common.actions'),
            accessor: (income: Income) => (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(income)
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedIncome(income)
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

    return (
        <div className="space-y-4">
            <SearchFilter
                categories={incomeCategories}
                onSearch={handleSearch}
                onFilter={handleFilter}
                onReset={handleReset}
            />

            <Table
                data={paginatedIncomes}
                columns={columns}
                isLoading={isLoading}
                emptyMessage={t('income.noIncome')}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={filteredIncomes.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedIncome(null)
                }}
                title={t('income.edit')}
            >
                {selectedIncome && (
                    <IncomeForm
                        initialData={{
                            amount: selectedIncome.amount,
                            description: selectedIncome.description,
                            category: selectedIncome.category,
                            date: selectedIncome.date,
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
                    setSelectedIncome(null)
                }}
                title={t('income.delete')}
            >
                <Alert
                    variant="destructive"
                    className="mb-4"
                >
                    <AlertDescription>
                        {t('income.deleteConfirm')}
                    </AlertDescription>
                </Alert>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowDeleteModal(false)
                            setSelectedIncome(null)
                        }}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        isLoading={isSubmitting}
                    >
                        {t('income.delete')}
                    </Button>
                </div>
            </Modal>
        </div>
    )
} 