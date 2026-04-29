import React, { useState, useEffect, useRef } from 'react';
import { WalletIcon, BellIcon, CheckCircleIcon } from './IconComponents';
import { AppNotification } from '../types';

interface HeaderProps {
    notifications: AppNotification[];
    onClearNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ notifications, onClearNotifications }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setIsPanelOpen(prev => !prev);
        if (unreadCount > 0) {
            onClearNotifications();
        }
    };
    
    const formatTimeAgo = (timestamp: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    }

    return (
        <header className="bg-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                       <WalletIcon className="h-10 w-10 text-white"/>
                        <h1 className="ml-3 text-2xl font-bold text-white tracking-tight">
                            Personal Financial Advisor
                        </h1>
                    </div>
                    <div className="relative" ref={panelRef}>
                        <button 
                            onClick={handleBellClick}
                            className="p-2 rounded-full text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                            aria-label="View notifications"
                        >
                            <BellIcon className="h-7 w-7" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {isPanelOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-80 md:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-lg font-semibold text-text-primary">Notifications</p>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div key={notification.id} className="px-4 py-3 hover:bg-base-100 border-b last:border-b-0">
                                                    <p className="text-sm text-text-primary">{notification.message}</p>
                                                    <p className="text-xs text-text-secondary mt-1">{formatTimeAgo(notification.timestamp)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 px-4">
                                                <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto"/>
                                                <p className="mt-2 text-sm text-text-secondary">You're all caught up!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;