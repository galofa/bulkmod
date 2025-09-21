import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    showLabel = false,
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: "bg-green-400",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500"
    };

    const sizes = {
      sm: "h-2",
      md: "h-4",
      lg: "h-6"
    };

    return (
      <div className="space-y-2" {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm text-green-200">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "w-full bg-green-900/50 rounded-full overflow-hidden",
            sizes[size],
            className
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-in-out",
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
