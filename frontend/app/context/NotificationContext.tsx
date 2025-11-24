'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import NotificationModal, { NotificationType } from '@/components/NotificationModal';

interface NotificationConfig {
    type: NotificationType;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

interface NotificationContextType {
    showNotification: (config: NotificationConfig) => void;
    showConfirm: (config: Omit<NotificationConfig, 'type'>) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<NotificationConfig>({
        type: 'info',
        title: '',
    });
    const [confirmResolve, setConfirmResolve] = useState<((value: boolean) => void) | null>(null);

    const showNotification = (notificationConfig: NotificationConfig) => {
        setConfig(notificationConfig);
        setIsOpen(true);
    };

    const showConfirm = (confirmConfig: Omit<NotificationConfig, 'type'>): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfig({ ...confirmConfig, type: 'confirm' });
            setConfirmResolve(() => resolve);
            setIsOpen(true);
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        if (confirmResolve) {
            confirmResolve(false);
            setConfirmResolve(null);
        }
    };

    const handleConfirm = () => {
        if (confirmResolve) {
            confirmResolve(true);
            setConfirmResolve(null);
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showConfirm }}>
            {children}
            <NotificationModal
                isOpen={isOpen}
                type={config.type}
                title={config.title}
                message={config.message}
                onClose={handleClose}
                onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
                confirmText={config.confirmText}
                cancelText={config.cancelText}
            />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
