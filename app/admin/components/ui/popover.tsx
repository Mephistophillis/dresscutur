"use client"

import React, { useState } from 'react';
import { cn } from "~/app/lib/utils"

interface PopoverProps {
  children: React.ReactNode;
}

const Popover = ({ children }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Контекст для передачи состояния и функции изменения состояния дочерним компонентам
  const contextValue = {
    isOpen,
    setIsOpen,
  };
  
  return (
    <PopoverContext.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

// Создаем контекст для Popover
const PopoverContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

// Hook для использования контекста
const usePopover = () => React.useContext(PopoverContext);

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PopoverTriggerProps
>(({ children, asChild, ...props }, ref) => {
  const { isOpen, setIsOpen } = usePopover();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    
    // Вызываем оригинальный обработчик клика, если он есть
    if (props.onClick) {
      props.onClick(e as React.MouseEvent<HTMLDivElement>);
    }
  };
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      ...props,
    });
  }
  
  return (
    <div {...props} ref={ref} onClick={handleClick}>
      {children}
    </div>
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = 'center', sideOffset = 4, ...props }, ref) => {
    const { isOpen } = usePopover();
    
    if (!isOpen) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-2 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 top-full",
          {
            'left-0': align === 'start',
            'left-1/2 -translate-x-1/2': align === 'center',
            'right-0': align === 'end',
          },
          className
        )}
        style={{
          marginTop: sideOffset,
        }}
        {...props}
      />
    );
  }
);

PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent } 