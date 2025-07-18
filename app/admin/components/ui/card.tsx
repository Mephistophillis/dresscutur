import React from 'react';
import { cn } from "../../../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={cn(
      "px-6 py-4 border-b border-slate-100 bg-slate-50/50",
      className
    )}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={cn(
      "text-lg font-semibold text-slate-900 leading-none tracking-tight",
      className
    )}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={cn(
      "text-sm text-slate-500 mt-1",
      className
    )}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={cn(
      "px-6 py-4 border-t border-slate-100 bg-slate-50/30",
      className
    )}>
      {children}
    </div>
  );
}

// Типы для компонента StatsCard
interface Trend {
  value: number;
  label?: string;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: Trend;
  change?: number;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  change,
  className = '' 
}: StatsCardProps) {
  // Определяем тренд на основе change если trend не передан
  const displayTrend = trend || (change !== undefined ? {
    value: Math.abs(change),
    isPositive: change > 0
  } : undefined);

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">{value}</h4>
            
            {displayTrend && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                displayTrend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {displayTrend.isPositive ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span>{displayTrend.value}%{displayTrend.label ? ` ${displayTrend.label}` : ''}</span>
              </div>
            )}
            
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Компонент для метрик с улучшенным дизайном
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  color?: 'violet' | 'green' | 'blue' | 'amber' | 'red';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'violet',
  className = '' 
}: MetricCardProps) {
  const colorClasses = {
    violet: 'bg-violet-100 text-violet-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              colorClasses[color]
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 