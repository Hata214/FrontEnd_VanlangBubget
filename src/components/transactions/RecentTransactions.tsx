'use client'

import { useTranslations } from 'next-intl'
import { Table } from '@/components/ui/Table'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Transaction {
    id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string
    date: string
}

interface RecentTransactionsProps {
    transactions: Transaction[]
    isLoading?: boolean
}

type ColumnAccessor = keyof Transaction | ((item: Transaction) => React.ReactNode)

interface Column {
    header: string
    accessor: ColumnAccessor
    className?: string
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
    const t = useTranslations();

    const columns: Column[] = [
        {
            header: t('common.date'),
            accessor: 'date',
            className: 'w-32',
        },
        {
            header: t('common.type'),
            accessor: (item: Transaction) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                >
                    {item.type === 'income' ? t('income.manage') : t('expense.manage')}
                </span>
            ),
            className: 'w-24',
        },
        {
            header: t('common.category'),
            accessor: 'category',
            className: 'w-32',
        },
        {
            header: t('common.description'),
            accessor: 'description',
        },
        {
            header: t('common.amount'),
            accessor: (item: Transaction) => (
                <span
                    className={
                        item.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }
                >
                    {formatCurrency(item.amount)}
                </span>
            ),
            className: 'w-32 text-right',
        },
    ]

    const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        date: formatDate(transaction.date),
    }))

    return (
        <Table
            data={formattedTransactions}
            columns={columns}
            isLoading={isLoading}
            emptyMessage={t('common.noData')}
        />
    )
} 