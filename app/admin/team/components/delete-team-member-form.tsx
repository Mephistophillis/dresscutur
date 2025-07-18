'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTeamMember } from '~/app/actions/admin/team-members';
import { toast } from 'sonner';

interface DeleteTeamMemberFormProps {
  id: string;
}

export default function DeleteTeamMemberForm({ id }: DeleteTeamMemberFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteTeamMember(id);
      
      if (result.success) {
        toast.success(result.message || 'Член команды успешно удален');
        router.push('/admin/team');
        router.refresh();
      } else {
        toast.error(result.message || 'Произошла ошибка при удалении');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      toast.error('Произошла ошибка при удалении члена команды');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex justify-center space-x-4">
      <button
        type="button"
        onClick={() => router.push('/admin/team')}
        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        disabled={isDeleting}
      >
        Отмена
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        disabled={isDeleting}
      >
        {isDeleting ? 'Удаление...' : 'Удалить'}
      </button>
    </div>
  );
} 