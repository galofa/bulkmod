import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { FiChevronDown } from 'react-icons/fi';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps<T extends string | number = string | number> {
  options: DropdownOption[];
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps<any>>(
  ({ 
    options, 
    value, 
    onValueChange, 
    placeholder = "Select option", 
    className,
    disabled = false,
    leftIcon
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleSelect = (optionValue: string | number) => {
      onValueChange(optionValue);
      setIsOpen(false);
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {leftIcon && <span>{leftIcon}</span>}
          <span className="flex-1 text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FiChevronDown className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
        
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20 py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors",
                  value === option.value && "bg-green-500/80 text-black font-bold"
                )}
                onClick={() => handleSelect(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
