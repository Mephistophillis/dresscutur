import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  href?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  href,
  className = '',
}: StatsCardProps) {
  const CardContent = () => (
    <>
      <div className="flex items-center">
        {icon && (
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        </div>
      </div>
      <div className="mt-2">
        {trend && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              trend.isPositive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {trend.isPositive ? (
              <svg
                className="mr-1 h-3 w-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="mr-1 h-3 w-3 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>
              {trend.value}% {trend.label}
            </span>
          </span>
        )}
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    </>
  );

  return href ? (
    <Link
      href={href}
      className={`block rounded-lg border border-gray-200 bg-white p-5 hover:bg-gray-50 transition-colors ${className}`}
    >
      <CardContent />
    </Link>
  ) : (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 ${className}`}>
      <CardContent />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
      <div className="flex items-center">
        <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 