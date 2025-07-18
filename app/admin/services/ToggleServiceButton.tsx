'use client';

import { toggleServiceActive } from '~/app/actions/admin/services-prisma';
import { Button } from '~/app/admin/components/ui/button';
import { useState, useTransition } from 'react';

interface ToggleServiceButtonProps {
  id: string;
  isActive: boolean;
}

export default function ToggleServiceButton({ id, isActive }: ToggleServiceButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [currentActive, setCurrentActive] = useState<boolean>(isActive);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleServiceActive(id);
      if (result.success) {
        setCurrentActive(!currentActive);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleToggle}
        disabled={isPending}
        className="text-blue-600 hover:text-blue-900 p-0 h-auto"
      >
        {isPending 
          ? 'Обновление...' 
          : currentActive 
            ? 'Деактивировать' 
            : 'Активировать'
        }
      </Button>
      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </>
  );
} 