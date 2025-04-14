import React from 'react';
import { Button } from './button';

// Таблица
type TableProps = React.HTMLAttributes<HTMLTableElement>

export function Table({ className = '', ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

// Заголовок таблицы
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

export function TableHeader({ className = '', ...props }: TableHeaderProps) {
  return (
    <thead className={`[&_tr]:border-b ${className}`} {...props} />
  );
}

// Тело таблицы
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

export function TableBody({ className = '', ...props }: TableBodyProps) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />;
}

// Строка таблицы
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

export function TableRow({ className = '', ...props }: TableRowProps) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100 ${className}`}
      {...props}
    />
  );
}

// Ячейка заголовка
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>

export function TableHead({ className = '', ...props }: TableHeadProps) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

// Ячейка данных
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

export function TableCell({ className = '', ...props }: TableCellProps) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

// Компонент для пагинации
type TablePaginationProps = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ 
  total, 
  pageSize, 
  currentPage, 
  onPageChange 
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  
  // Генерируем массив номеров страниц для отображения
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    
    return items;
  };
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-500">
        Показано {Math.min((currentPage - 1) * pageSize + 1, total)}-{Math.min(currentPage * pageSize, total)} из {total} записей
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Назад
        </Button>
        
        {getPaginationItems().map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Вперед
        </Button>
      </div>
    </div>
  );
}

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function TableFooter({ children, className = '' }: TableFooterProps) {
  return (
    <tfoot className={`bg-gray-50 ${className}`}>
      {children}
    </tfoot>
  );
}

export function TableEmpty({ message = 'No data available' }: { message?: string }) {
  return (
    <TableRow>
      <TableCell colSpan={100} className="text-center py-8">
        <p className="text-gray-500">{message}</p>
      </TableCell>
    </TableRow>
  );
} 