'use client';

import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell,
  TableEmpty
} from '~/app/admin/components/ui/table';
import { Button } from '~/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/app/components/ui/dialog';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { updateContactStatus, addContactNote } from '~/app/actions/admin/contacts';
import { Textarea } from '~/app/components/ui/textarea';
import { Contact } from '~/app/lib/definitions';

interface ContactsTableProps {
  contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  const [noteDialogOpen, setNoteDialogOpen] = React.useState(false);
  const [currentContactId, setCurrentContactId] = React.useState<string | null>(null);
  const [note, setNote] = React.useState('');

  if (!contacts || contacts.length === 0) {
    return <TableEmpty message="Нет заявок, соответствующих выбранным критериям" />;
  }

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED') => {
    try {
      const result = await updateContactStatus(id, newStatus);
      if (result.success) {
        // Можно добавить уведомление об успехе
      } else {
        console.error("Не удалось обновить статус:", result.error);
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  // Handle note submission
  const handleNoteSubmit = async () => {
    if (!currentContactId || !note.trim()) return;
    
    try {
      const result = await addContactNote(currentContactId, note);
      if (result.success) {
        setNoteDialogOpen(false);
        setNote('');
      } else {
        console.error("Не удалось добавить примечание:", result.error);
      }
    } catch (error) {
      console.error("Ошибка при добавлении примечания:", error);
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return { className: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs', text: 'Новая' };
      case 'IN_PROGRESS':
        return { className: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs', text: 'В обработке' };
      case 'COMPLETED':
        return { className: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs', text: 'Завершена' };
      case 'CANCELED':
        return { className: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs', text: 'Отменена' };
      default:
        return { className: 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs', text: status };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Клиент</TableHead>
            <TableHead>Сообщение</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            const statusInfo = getStatusBadge(contact.status);
            
            return (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && <div className="text-sm text-gray-500">{contact.phone}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="line-clamp-2 text-sm">{contact.message}</p>
                    {contact.notes && (
                      <div className="mt-2 text-xs text-gray-500 border-l-2 border-blue-500 pl-2">
                        <p className="font-semibold">Примечание:</p>
                        <p className="line-clamp-1">{contact.notes}</p>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDate(contact.createdAt)}</span>
                </TableCell>
                <TableCell>
                  <span className={statusInfo.className}>
                    {statusInfo.text}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentContactId(contact.id);
                        setNoteDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    
                    {contact.status !== 'COMPLETED' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(contact.id, 'COMPLETED')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {contact.status !== 'CANCELED' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusUpdate(contact.id, 'CANCELED')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить примечание</DialogTitle>
            <DialogDescription>
              Добавьте примечание к заявке для внутреннего использования
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Введите текст примечания..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleNoteSubmit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 