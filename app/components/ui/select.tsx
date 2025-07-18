'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '~/app/lib/utils'

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({
  defaultValue,
  value,
  onValueChange,
  children
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || '')
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback((newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }, [onValueChange])

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

export function SelectTrigger({ className, placeholder, ...props }: SelectTriggerProps) {
  const { value, open, setOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      {...props}
    >
      <span className="flex-1 text-left">{value || placeholder || 'Выберите'}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  const { value } = React.useContext(SelectContext)

  return <>{value && children}</>
}

type SelectContentProps = React.HTMLAttributes<HTMLDivElement>;

export function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { open } = React.useContext(SelectContext)

  if (!open) return null

  return (
    <div 
      className={cn(
        'absolute z-50 w-full min-w-[8rem] rounded-md border bg-popover p-1 shadow-md',
        className
      )}
      {...props}
    >
      <div className="max-h-[300px] overflow-auto py-1">
        {children}
      </div>
    </div>
  )
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        isSelected && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </div>
  )
} 