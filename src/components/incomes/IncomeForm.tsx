'use client'

import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/Form'

const incomeSchema = z.object({
    amount: z.number().min(1000, {
        message: 'Số tiền phải lớn hơn 1,000đ'
    }),
    description: z.string().min(1, {
        message: 'Mô tả là bắt buộc'
    }),
    category: z.string().min(1, {
        message: 'Danh mục là bắt buộc'
    }),
    customCategory: z.string().optional(),
    date: z.string().min(1, {
        message: 'Ngày là bắt buộc'
    }),
})

export type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeFormProps {
    initialData?: Partial<IncomeFormData>
    onSubmit: (data: IncomeFormData) => Promise<void>
    isSubmitting?: boolean
}

export function IncomeForm({ initialData, onSubmit, isSubmitting }: IncomeFormProps) {
    const t = useTranslations();
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    const incomeCategories = [
        { value: 'SALARY', label: t('income.category.salary') },
        { value: 'BONUS', label: t('income.category.bonus') },
        { value: 'INVESTMENT', label: t('income.category.investment') },
        { value: 'BUSINESS', label: t('income.category.business') },
        { value: 'OTHER', label: t('income.category.other') },
    ]

    const form = useForm<IncomeFormData>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            amount: initialData?.amount || 0,
            description: initialData?.description || '',
            category: initialData?.category || '',
            customCategory: '',
            date: initialData?.date || new Date().toISOString().split('T')[0],
        },
    });

    const watchCategory = form.watch("category");

    // Khi category thay đổi, cập nhật trạng thái hiển thị trường nhập danh mục tùy chỉnh
    useEffect(() => {
        if (watchCategory === 'OTHER') {
            setShowCustomCategory(true);
        } else {
            setShowCustomCategory(false);
            // Reset giá trị customCategory khi không chọn "Khác"
            form.setValue('customCategory', '');
        }
    }, [watchCategory, form]);

    const handleSubmit = async (data: IncomeFormData) => {
        try {
            // Nếu chọn "Khác" và nhập danh mục tùy chỉnh, sử dụng giá trị tùy chỉnh làm danh mục
            const submissionData = { ...data };
            if (data.category === 'OTHER' && data.customCategory) {
                submissionData.category = data.customCategory;
            }

            await onSubmit(submissionData);
            if (!initialData) {
                form.reset();
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
                            <FormLabel>{t('income.amount')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder={t('income.enterAmount')}
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
                            <FormLabel>{t('income.description')}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t('income.enterDescription')}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('common.category')}</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('income.selectCategory')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {incomeCategories.map((category) => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {showCustomCategory && (
                    <FormField
                        control={form.control}
                        name="customCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('income.customCategory')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('income.enterCustomCategory')}
                                        {...field}
                                        autoFocus
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('common.date')}</FormLabel>
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

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        {initialData ? t('income.edit') : t('income.add')}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 