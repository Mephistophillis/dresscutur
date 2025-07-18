import TeamMemberForm from '../components/team-member-form';
import { AdminHeader } from '~/app/admin/components/ui/admin-header';

export default function NewTeamMemberPage() {
  return (
    <div>
      <AdminHeader 
        title="Добавление члена команды" 
        description="Создание новой записи о члене команды"
        backButton={{
          label: 'Назад к списку',
          href: '/admin/team',
        }}
      />
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <TeamMemberForm />
      </div>
    </div>
  );
} 