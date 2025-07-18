import Link from 'next/link';
import { getServices } from '~/app/actions/admin/services-prisma';
import { Button } from '~/app/admin/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/app/admin/components/ui/card';
import { Badge } from '~/app/admin/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/app/admin/components/ui/table';
import DeleteServiceButton from './DeleteServiceButton';
import ToggleServiceButton from './ToggleServiceButton';
import { Scissors, Plus, Eye, Edit } from 'lucide-react';

export default async function ServicesPage() {
  // Получаем реальные данные из БД через server action
  const services = await getServices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Услуги</h1>
          <p className="text-slate-600 mt-1">Управление услугами ателье</p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить услугу
          </Button>
        </Link>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Scissors className="h-5 w-5 mr-2 text-violet-600" />
            Список услуг ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="p-12 text-center">
              <Scissors className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Нет услуг</h3>
              <p className="text-slate-500 mb-4">Добавьте первую услугу для вашего ателье</p>
              <Link href="/admin/services/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить услугу
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{service.name}</p>
                        {service.category && (
                          <p className="text-sm text-slate-500">{service.category}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-600 max-w-xs truncate">
                        {service.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? 'success' : 'secondary'}>
                        {service.isActive ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{service.order}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/services/${service.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/services/${service.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <ToggleServiceButton 
                          id={service.id} 
                          isActive={service.isActive} 
                        />
                        <DeleteServiceButton id={service.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{services.length}</p>
              <p className="text-sm text-slate-600">Всего услуг</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.isActive).length}
              </p>
              <p className="text-sm text-slate-600">Активных</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-500">
                {services.filter(s => !s.isActive).length}
              </p>
              <p className="text-sm text-slate-600">Неактивных</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 