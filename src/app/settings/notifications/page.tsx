'use client'

import { useTranslations } from 'next-intl'
import { EmailSettings } from '@/components/settings/EmailSettings'

export default function NotificationsPage() {
    const t = useTranslations()

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">{t('notifications.title')}</h1>
            <p className="text-gray-500 mb-6">{t('notifications.subtitle')}</p>
            <EmailSettings />
        </div>
    )
} 