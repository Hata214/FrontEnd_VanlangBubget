'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { formatCurrency } from '@/lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'right' as const,
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    let label = context.label || ''
                    if (label) {
                        label += ': '
                    }
                    if (context.parsed !== null) {
                        label += formatCurrency(context.parsed)
                    }
                    const dataset = context.dataset
                    const total = dataset.data.reduce((acc: number, current: number) => acc + current, 0)
                    const percentage = Math.round((context.parsed * 100) / total)
                    return `${label} (${percentage}%)`
                },
            },
        },
    },
}

interface PieChartProps {
    data: {
        labels: string[]
        datasets: {
            data: number[]
            backgroundColor: string[]
            borderColor: string[]
            borderWidth: number
        }[]
    }
}

export function PieChart({ data }: PieChartProps) {
    return <Pie options={options} data={data} />
} 