import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import notificationService from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
    id: string;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationBell: React.FC = () => {
    const t = useTranslations();
    const [items, setItems] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Kiểm tra thông báo mới mỗi phút
        const interval = setInterval(checkNewNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const notifications = await notificationService.getAll();
            setItems(notifications);
            setUnreadCount(notifications.filter((notification: Notification) => !notification.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkNewNotifications = async () => {
        try {
            await notificationService.checkLoanDueDates();
            fetchNotifications();
        } catch (error) {
            console.error(t('notification.errorChecking'), error);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === notificationId ? { ...item, isRead: true } : item
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(t('notification.errorMarkRead'), error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setItems(prevItems =>
                prevItems.map(item => ({ ...item, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error(t('notification.errorMarkAllRead'), error);
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setItems(prevItems => prevItems.filter(item => item.id !== notificationId));
            const deletedItem = items.find(item => item.id === notificationId);
            if (deletedItem && !deletedItem.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error(t('notification.errorDelete'), error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'DUE_DATE':
                return '⏰';
            case 'PAYMENT_DUE':
                return '💰';
            case 'OVERDUE':
                return '⚠️';
            default:
                return '📢';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-primary focus:outline-none"
                aria-label={t('notification.toggle')}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">{t('notification.title')}</h3>
                            {items.length > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm text-primary hover:text-primary-dark"
                                >
                                    {t('notification.markAllRead')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                {t('common.loading')}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                {t('notification.empty')}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {items.map((notification: Notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 text-xl">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm text-gray-900">
                                                    {notification.message}
                                                </p>
                                                <div className="mt-1 flex justify-between items-center">
                                                    <p className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                                            addSuffix: true,
                                                            locale: vi
                                                        })}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="text-xs text-primary hover:text-primary-dark"
                                                            >
                                                                {t('notification.markRead')}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            {t('common.delete')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell; 