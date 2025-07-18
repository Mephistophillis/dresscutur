import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTeamMemberById } from '~/app/actions/admin/team-members';
import { AdminHeader } from '~/app/admin/components/ui/admin-header';
import DeleteTeamMemberForm from '../../components/delete-team-member-form';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  bio: string;
  location?: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteTeamMemberPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export default async function DeleteTeamMemberPage({ params }: DeleteTeamMemberPageProps) {
  const { id } = await params;
  const result = await getTeamMemberById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }
  
  const teamMember = result.data as TeamMember;
  
  return (
    <div>
      <AdminHeader 
        title="Удаление члена команды" 
        description="Подтверждение удаления члена команды"
        backButton={{
          label: 'Назад к списку',
          href: '/admin/team',
        }}
      />
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col items-center p-6 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="w-24 h-24 relative overflow-hidden rounded-full mb-4">
            <Image 
              src={teamMember.photo} 
              alt={teamMember.name} 
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{teamMember.name}</h3>
          <p className="text-gray-600">{teamMember.position}</p>
          
          <div className="mt-8 text-center">
            <p className="text-red-600 font-semibold mb-4">
              Вы уверены, что хотите удалить этого члена команды?
            </p>
            <p className="text-gray-500 mb-6">
              Это действие необратимо и удалит всю информацию о данном члене команды.
            </p>
            
            <DeleteTeamMemberForm id={teamMember.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 