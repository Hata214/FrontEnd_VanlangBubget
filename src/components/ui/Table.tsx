'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => ReactNode)
    className?: string
}

interface TableProps<T> {
    data: T[]
    columns: readonly Column<T>[]
    isLoading?: boolean
    onRowClick?: (item: T) => void
    emptyMessage?: string
    className?: string
}

export function Table<T>({
    data,
    columns,
    isLoading,
    onRowClick,
    emptyMessage = 'Không có dữ liệu',
    className,
    ...props
}: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-muted rounded mb-4" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded mb-2" />
                ))}
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto">
            <table
                className={cn(
                    'w-full border-collapse text-left text-sm',
                    className
                )}
                {...props}
            >
                <thead>
                    <tr className="border-b bg-muted/50">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={cn(
                                    'px-4 py-3 font-medium text-foreground',
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick?.(item)}
                            className={cn(
                                'border-b transition-colors hover:bg-muted/50',
                                onRowClick && 'cursor-pointer'
                            )}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={cn('px-4 py-3', column.className)}
                                >
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : (item[column.accessor] as ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 