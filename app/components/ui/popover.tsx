'use client';

import * as React from 'react';
import { cn } from '~/app/lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
});

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  return (
    <PopoverContext.Provider
      value={{
        open: isOpen,
        setOpen: handleOpenChange,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  ...props
}) => {
  const { setOpen, open } = React.useContext(PopoverContext);
  
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="dialog"
      {...props}
    >
      {children}
    </button>
  );
};

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'center' | 'start' | 'end';
  sideOffset?: number;
}

const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}) => {
  const { open } = React.useContext(PopoverContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 w-72 rounded-md border bg-popover p-4 shadow-md outline-none',
        {
          'left-1/2 -translate-x-1/2': align === 'center',
          'left-0': align === 'start',
          'right-0': align === 'end',
        },
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent }; 