import React from 'react';
import { cn } from '../../utils/cn';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = 'info', 
    title, 
    children, 
    onClose,
    ...props 
  }, ref) => {
    const variants = {
      success: {
        container: "bg-green-900/50 border-green-500 text-green-200",
        icon: FiCheckCircle,
        iconColor: "text-green-400"
      },
      error: {
        container: "bg-red-900/50 border-red-500 text-red-200",
        icon: FiAlertCircle,
        iconColor: "text-red-400"
      },
      warning: {
        container: "bg-yellow-900/50 border-yellow-500 text-yellow-200",
        icon: FiAlertCircle,
        iconColor: "text-yellow-400"
      },
      info: {
        container: "bg-blue-900/50 border-blue-500 text-blue-200",
        icon: FiInfo,
        iconColor: "text-blue-400"
      }
    };

    const { container, icon: Icon, iconColor } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-lg px-4 py-3 relative",
          container,
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", iconColor)} />
          <div className="flex-1">
            {title && (
              <h4 className="font-medium mb-1">{title}</h4>
            )}
            <div>{children}</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-black/20 rounded transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
