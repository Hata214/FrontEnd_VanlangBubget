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
import { MapPin } from 'lucide-react'

const expenseSchema = z.object({
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
    location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string()
    }).optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
    initialData?: Partial<ExpenseFormData>
    onSubmit: (data: ExpenseFormData) => Promise<void>
    isSubmitting?: boolean
}

export function ExpenseForm({ initialData, onSubmit, isSubmitting }: ExpenseFormProps) {
    const t = useTranslations();
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    const expenseCategories = [
        { value: 'FOOD', label: t('expense.category.food') },
        { value: 'TRANSPORT', label: t('expense.category.transport') },
        { value: 'SHOPPING', label: t('expense.category.shopping') },
        { value: 'ENTERTAINMENT', label: t('expense.category.entertainment') },
        { value: 'BILLS', label: t('expense.category.bills') },
        { value: 'HEALTH', label: t('expense.category.health') },
        { value: 'EDUCATION', label: t('expense.category.education') },
        { value: 'OTHER', label: t('expense.category.other') },
    ]

    const form = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: initialData?.amount || 0,
            description: initialData?.description || '',
            category: initialData?.category || '',
            customCategory: '',
            date: initialData?.date || new Date().toISOString().split('T')[0],
            location: initialData?.location || undefined,
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

    const handleSubmit = async (data: ExpenseFormData) => {
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

    const handleGetLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    )
                    const data = await response.json()
                    form.setValue('location', {
                        lat: latitude,
                        lng: longitude,
                        address: data.display_name,
                    })
                } catch (error) {
                    console.error('Geocoding error:', error)
                }
            })
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
                            <FormLabel>{t('expense.amount')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder={t('expense.enterAmount')}
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
                            <FormLabel>{t('common.description')}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t('expense.enterDescription')}
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
                                        <SelectValue placeholder={t('expense.selectCategory')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {expenseCategories.map((category) => (
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
                                <FormLabel>{t('expense.customCategory')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('expense.enterCustomCategory')}
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

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('expense.location')}</FormLabel>
                            <div className="flex items-center space-x-2">
                                <FormControl>
                                    <Input
                                        placeholder={t('expense.selectLocation')}
                                        value={field.value?.address || ''}
                                        readOnly
                                    />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleGetLocation}
                                >
                                    <MapPin className="w-4 h-4" />
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        {initialData ? t('expense.edit') : t('expense.add')}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 