import React from 'react';
import { Button } from './button';
import { cn } from "../../../../lib/utils";

// Таблица
type TableProps = React.HTMLAttributes<HTMLTableElement>

export function Table({ className = '', ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

// Заголовок таблицы
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

export function TableHeader({ className = '', ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn("bg-slate-50 border-b border-slate-200", className)}
      {...props}
    />
  );
}

// Строка заголовка
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

export function TableRow({ className = '', ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-slate-100 transition-colors",
        "hover:bg-slate-50/75 data-[state=selected]:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}

// Ячейка заголовка
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>

export function TableHead({ className = '', ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-slate-700",
        "text-xs uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
}

// Тело таблицы
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

export function TableBody({ className = '', ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

// Ячейка таблицы
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

export function TableCell({ className = '', ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "p-4 align-middle text-slate-900",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

// Компонент пагинации
interface TablePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className = '',
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const pages = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3",
      "border-t border-slate-200 bg-white",
      className
    )}>
      <div className="text-sm text-slate-700">
        Показано {startItem}-{endItem} из {totalItems} записей
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          ←
        </Button>
        
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 py-1 text-slate-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          →
        </Button>
      </div>
    </div>
  );
}

// Пустое состояние таблицы
interface TableEmptyProps {
  message?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function TableEmpty({
  message = "Нет данных",
  description = "Данные для отображения отсутствуют",
  action,
  className = '',
}: TableEmptyProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">{message}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// Состояние загрузки таблицы
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableLoading({
  rows = 5,
  columns = 4,
  className = '',
}: TableLoadingProps) {
  return (
    <div className={cn("w-full overflow-auto rounded-lg border border-slate-200 bg-white", className)}>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="h-12 px-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 