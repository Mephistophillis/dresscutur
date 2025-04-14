import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TablePagination } from './table';
import { Input } from './input';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchKey?: keyof T;
  defaultSortField?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchKey,
  defaultSortField,
  defaultSortDirection = 'asc',
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof T | null>(defaultSortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  // Функция для обработки поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Сбрасываем страницу при поиске
  };

  // Функция для обработки сортировки
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      // Если уже сортируем по этому полю, меняем направление
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Устанавливаем новое поле для сортировки
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Фильтрация данных на основе поискового запроса
  const filteredData = searchable && searchQuery && searchKey
    ? data.filter(item => {
        const value = item[searchKey];
        return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    : data;

  // Сортировка данных
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Вычисляем пагинацию
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Иконки для индикации сортировки
  const renderSortIcon = (field: keyof T) => {
    if (sortField !== field) return <span className="ml-1">⇅</span>;
    return sortDirection === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  return (
    <div className="space-y-4">
      {searchable && searchKey && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.accessorKey)}
                className={column.sortable ? 'cursor-pointer select-none' : ''}
                onClick={column.sortable ? () => handleSort(column.accessorKey) : undefined}
              >
                {column.header}
                {column.sortable && renderSortIcon(column.accessorKey)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                Нет данных для отображения
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick ? 'cursor-pointer' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${String(column.accessorKey)}`}>
                    {column.cell ? column.cell(row) : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            total={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
} 