import React from 'react';
import Link from 'next/link';

// Dashboard card for navigating to different sections
export function DashboardCard({ 
  title, 
  description, 
  href, 
  icon: Icon 
}: { 
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center mb-2">
        {Icon && <Icon className="w-6 h-6 text-primary mr-2" />}
        <h5 className="text-xl font-medium text-gray-900">{title}</h5>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

// Stats card for showing dashboard metrics
export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true
}: {
  title: string;
  value: string | number;
  change?: string | number;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="w-6 h-6 text-gray-400" />}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
        {change && (
          <span className={`ml-2 text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
}

// Activity card for recent activity/logs
export function ActivityCard({
  title,
  activities
}: {
  title: string;
  activities: {
    id: string;
    description: string;
    time: string;
    user?: string;
  }[];
}) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{activity.description}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span>{activity.time}</span>
                {activity.user && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{activity.user}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 