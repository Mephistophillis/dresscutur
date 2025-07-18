import Link from 'next/link';
import { Button } from './button';
import { ChevronLeft } from 'lucide-react';

interface ActionButton {
  label: string;
  href: string;
}

interface AdminHeaderProps {
  title: string;
  description?: string;
  actionButton?: ActionButton;
  backButton?: ActionButton;
}

export function AdminHeader({ title, description, actionButton, backButton }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col">
        {backButton && (
          <Link href={backButton.href} className="mb-2 flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {backButton.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      {actionButton && (
        <Link href={actionButton.href} className="shrink-0">
          <Button variant="default">{actionButton.label}</Button>
        </Link>
      )}
    </div>
  );
} 