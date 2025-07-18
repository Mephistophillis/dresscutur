'use client';

import { useState } from 'react';
import { toggleTeamMemberActive } from '~/app/actions/admin/team-members';
import { toast } from 'sonner';

interface TeamMemberStatusButtonProps {
  id: string;
  isActive: boolean;
}

export default function TeamMemberStatusButton({ id, isActive }: TeamMemberStatusButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState(isActive);

  async function handleStatusToggle() {
    try {
      setIsPending(true);
      const result = await toggleTeamMemberActive(id);
      
      if (result.success) {
        setStatus(!status);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Ошибка изменения статуса');
      }
    } catch (error) {
      toast.error('Произошла ошибка при изменении статуса');
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleStatusToggle}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        status
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
    >
      {isPending ? 'Обновление...' : status ? 'Активен' : 'Неактивен'}
    </button>
  );
} 