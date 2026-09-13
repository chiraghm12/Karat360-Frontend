import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * FilterDropdown - A luxury custom filter dropdown component with smooth rotating chevron arrow,
 * click-outside handling, active indicator, and theme integration.
 */
const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  labelPrefix = '',
  icon: Icon = null,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  align = 'left',
  size = 'md', // 'sm' | 'md'
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Normalize options to { value, label, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value ?? opt.label,
        label: opt.label ?? String(opt.value),
        icon: opt.icon || null,
        badge: opt.badge || null,
      };
    }
    return {
      value: opt,
      label: String(opt),
      icon: null,
      badge: null,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    value,
    label: value !== undefined && value !== null && value !== '' ? String(value) : placeholder,
  };

  const handleSelect = (optValue) => {
    onChange?.(optValue);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-3.5 py-2.5 text-sm rounded-xl min-h-[42px]',
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 bg-white dark:bg-gray-900 border transition-all duration-200 group cursor-pointer select-none text-left ${
          sizeClasses[size] || sizeClasses.md
        } ${
          isOpen
            ? 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
            : 'border-slate-200 dark:border-slate-800 hover:border-amber-400/50 dark:hover:border-amber-500/40 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && (
            <span className={`flex-shrink-0 transition-colors ${isOpen ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-500'}`}>
              <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            </span>
          )}
          {labelPrefix && (
            <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">
              {labelPrefix}:
            </span>
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {selectedOption?.label || placeholder}
          </span>
        </div>

        {/* Rotating Down Arrow */}
        <ChevronDown
          className={`flex-shrink-0 transition-transform duration-200 ease-out ${
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          } ${
            isOpen
              ? 'rotate-180 text-amber-500'
              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className={`absolute mt-1.5 w-full min-w-[160px] max-h-64 overflow-y-auto z-[9999] bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 p-1.5 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
          role="listbox"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            const OptIcon = opt.icon;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2 truncate">
                  {OptIcon && <OptIcon className="w-3.5 h-3.5 text-slate-400" />}
                  <span className="truncate">{opt.label}</span>
                </div>
                {opt.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold ml-2">
                    {opt.badge}
                  </span>
                )}
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
