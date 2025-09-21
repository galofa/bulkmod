import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const colors = {
  success: 'bg-green-800 border-green-400 text-green-100',
  error: 'bg-red-800 border-red-400 text-red-100',
  info: 'bg-blue-800 border-blue-400 text-blue-100',
  warning: 'bg-yellow-800 border-yellow-400 text-yellow-100',
};

export default function Notification() {
  const { notification } = useNotification();
  if (!notification || !notification.visible) return null;
  const Icon = icons[notification.type] || FiInfo;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 transition-all duration-300 ${colors[notification.type]} animate-fade-in`}
      style={{ minWidth: 280, maxWidth: 400 }}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="font-medium text-base">{notification.message}</span>
    </div>
  );
}
