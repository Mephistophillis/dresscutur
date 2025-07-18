'use client';

import React from 'react';
import { cn } from "../../../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'default' | 'lg';
  color?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', color, style, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-violet-100 text-violet-800 border-violet-200',
      secondary: 'bg-slate-100 text-slate-800 border-slate-200',
      destructive: 'bg-red-100 text-red-800 border-red-200',
      outline: 'text-slate-700 border-slate-300 bg-transparent',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-amber-100 text-amber-800 border-amber-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      default: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    const combinedStyle = color 
      ? { ...style, backgroundColor: color, color: 'white' } 
      : style;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={combinedStyle}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

// Статусные badge компоненты для удобства
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'new' | 'in_progress';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Активен' },
    inactive: { variant: 'secondary' as const, label: 'Неактивен' },
    pending: { variant: 'warning' as const, label: 'Ожидание' },
    completed: { variant: 'success' as const, label: 'Завершен' },
    cancelled: { variant: 'destructive' as const, label: 'Отменен' },
    new: { variant: 'info' as const, label: 'Новый' },
    in_progress: { variant: 'default' as const, label: 'В работе' },
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

// Priority badge
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { variant: 'secondary' as const, label: 'Низкий' },
    medium: { variant: 'info' as const, label: 'Средний' },
    high: { variant: 'warning' as const, label: 'Высокий' },
    urgent: { variant: 'destructive' as const, label: 'Срочный' },
  };

  const config = priorityConfig[priority];
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export { Badge }; 