'use client';

import { deleteService } from '~/app/actions/admin/services-prisma';
import { Button } from '~/app/admin/components/ui/button';
import { useState, useTransition } from 'react';

interface DeleteServiceButtonProps {
  id: string;
}

export default function DeleteServiceButton({ id }: DeleteServiceButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      setError(null);
      startTransition(async () => {
        const result = await deleteService(id);
        if (!result.success && result.error) {
          setError(result.error);
        }
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-900 p-0 h-auto"
      >
        {isPending ? 'Удаление...' : 'Удалить'}
      </Button>
      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </>
  );
} 