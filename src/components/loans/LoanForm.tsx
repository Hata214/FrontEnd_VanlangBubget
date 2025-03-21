'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/Form'
import type { Loan } from '@/types'

const loanSchema = z.object({
    amount: z.number().min(1000, 'Số tiền phải lớn hơn 1,000đ'),
    description: z.string().min(1, 'Mô tả là bắt buộc'),
    lender: z.string().min(1, 'Người cho vay là bắt buộc'),
    interestRate: z.number().min(0, 'Lãi suất không được âm').max(100, 'Lãi suất không được vượt quá 100%'),
    startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
    dueDate: z.string().min(1, 'Ngày đáo hạn là bắt buộc'),
    status: z.enum(['ACTIVE', 'PAID', 'OVERDUE']).default('ACTIVE'),
})

type LoanFormData = z.infer<typeof loanSchema>

interface LoanFormProps {
    initialData?: Partial<LoanFormData>
    onSubmit: (data: LoanFormData) => Promise<void>
    isSubmitting?: boolean
}

// Danh sách người cho vay - giống như trong LoanList
const LOAN_LENDERS = [
    'Cá nhân',
    'Ngân hàng',
    'Tín dụng',
    'Khác',
]

export function LoanForm({ initialData, onSubmit, isSubmitting }: LoanFormProps) {
    const t = useTranslations();
    const [selectedLenderType, setSelectedLenderType] = useState<string>(initialData?.lender && LOAN_LENDERS.includes(initialData.lender) ? initialData.lender : 'Khác');
    const [customLender, setCustomLender] = useState<string>(initialData?.lender && !LOAN_LENDERS.includes(initialData.lender) ? initialData.lender : '');

    const form = useForm<LoanFormData>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            amount: initialData?.amount || 0,
            description: initialData?.description || '',
            lender: initialData?.lender || '',
            interestRate: initialData?.interestRate || 0,
            startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
            dueDate: initialData?.dueDate || '',
            status: initialData?.status || 'ACTIVE',
        },
    })

    // Cập nhật giá trị lender khi thay đổi loại người cho vay hoặc tên tùy chỉnh
    useEffect(() => {
        if (selectedLenderType === 'Khác') {
            form.setValue('lender', customLender);
        } else {
            form.setValue('lender', selectedLenderType);
        }
    }, [selectedLenderType, customLender, form])

    const handleSubmit = async (data: LoanFormData) => {
        try {
            await onSubmit(data)
            if (!initialData) {
                form.reset()
                setSelectedLenderType('Cá nhân')
                setCustomLender('')
            }
        } catch (error) {
            console.error('Submit error:', error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('loan.amount')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder={t('loan.enterAmount', { defaultMessage: 'Nhập số tiền' })}
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('loan.description')}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t('loan.enterDescription', { defaultMessage: 'Nhập mô tả khoản vay' })}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('loan.lender')}</FormLabel>
                            <div className="space-y-3">
                                <Select
                                    value={selectedLenderType}
                                    onValueChange={(value) => setSelectedLenderType(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('loan.selectLender', { defaultMessage: 'Chọn người cho vay' })} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOAN_LENDERS.map((lender) => (
                                            <SelectItem key={lender} value={lender}>
                                                {lender}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedLenderType === 'Khác' && (
                                    <Input
                                        placeholder={t('loan.enterCustomLender', { defaultMessage: 'Nhập tên người cho vay khác' })}
                                        value={customLender}
                                        onChange={(e) => setCustomLender(e.target.value)}
                                    />
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('loan.interestRate')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder={t('loan.enterInterestRate', { defaultMessage: 'Nhập lãi suất' })}
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('loan.startDate')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('loan.dueDate')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        {initialData ? t('common.update') : t('loan.add')}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 