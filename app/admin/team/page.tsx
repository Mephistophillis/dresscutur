import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTeamMembers } from '~/app/actions/admin/team-members';
import { AdminHeader } from '~/app/admin/components/ui/admin-header';
import TeamMemberStatusButton from './components/status-button';

// Интерфейс для члена команды
interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  location?: string | null;
  order: number;
  isActive: boolean;
  bio: string;
  socialLinks?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

function TeamMembersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full h-20 bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>
    </div>
  );
}

async function TeamMembersTable() {
  const result = await getTeamMembers();
  const members = result.success ? (result.data as TeamMember[]) : [];

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-lg text-gray-500">Список членов команды пуст</p>
        <Link 
          href="/admin/team/new" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Добавить первого члена команды
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Фото</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Должность</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Локация</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Порядок</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-16 h-16 relative overflow-hidden rounded-full">
                  <Image 
                    src={member.photo} 
                    alt={member.name} 
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.location || '—'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.order}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TeamMemberStatusButton 
                  id={member.id}
                  isActive={member.isActive}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <Link 
                    href={`/admin/team/${member.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Редактировать
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link 
                    href={`/admin/team/${member.id}/delete`}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TeamMembersPage() {
  return (
    <div>
      <AdminHeader 
        title="Управление членами команды" 
        description="Добавляйте, редактируйте и управляйте членами команды ателье"
        actionButton={{
          label: 'Добавить члена команды',
          href: '/admin/team/new',
        }}
      />
      
      <div className="mt-8">
        <Suspense fallback={<TeamMembersTableSkeleton />}>
          <TeamMembersTable />
        </Suspense>
      </div>
    </div>
  );
} 