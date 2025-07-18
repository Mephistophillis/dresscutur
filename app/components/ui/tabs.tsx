"use client"

import * as React from "react"
import { cn } from "~/app/lib/utils"

interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

interface TabsContextProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

interface TabComponentProps {
  value: string;
  children: React.ReactNode;
}

const Tabs = ({ children, defaultTab, className = '' }: TabsProps) => {
  // Найти первый таб для использования в качестве значения по умолчанию
  const findFirstTabValue = (): string => {
    const childrenArray = React.Children.toArray(children);
    for (const child of childrenArray) {
      if (
        React.isValidElement(child) && 
        child.type && 
        // @ts-expect-error - Используем displayName для определения типа компонента
        child.type.displayName === 'TabsList' && 
        // @ts-expect-error - Проверяем наличие value в props
        'value' in child.props
      ) {
        return (child.props as TabComponentProps).value;
      }
    }
    return '';
  };

  const [activeTab, setActiveTab] = React.useState(defaultTab || findFirstTabValue());

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  TabsListProps
>(({ children, className }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )} 
      role="tablist"
    >
      {children}
    </div>
  );
});
TabsList.displayName = "TabsList";

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ children, value, className, disabled = false }, ref) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };
  
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-background text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const TabsContent = React.forwardRef<
  HTMLDivElement,
  TabsContentProps
>(({ children, value, className }, ref) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      tabIndex={0}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent } 