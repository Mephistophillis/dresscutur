import React, { useState } from 'react';

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

export function Tabs({ children, defaultTab, className = '' }: TabsProps) {
  // Найти первый таб для использования в качестве значения по умолчанию
  const findFirstTabValue = (): string => {
    const childrenArray = React.Children.toArray(children);
    for (const child of childrenArray) {
      if (
        React.isValidElement(child) && 
        child.type && 
        // @ts-expect-error - Используем displayName для определения типа компонента
        child.type.displayName === 'Tab' && 
        // @ts-expect-error - Проверяем наличие value в props
        'value' in child.props
      ) {
        return (child.props as TabComponentProps).value;
      }
    }
    return '';
  };

  const [activeTab, setActiveTab] = useState(defaultTab || findFirstTabValue());

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export function Tab({ children, value, className = '', disabled = false }: TabProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
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
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      className={`px-4 py-2 text-sm font-medium transition-colors 
        ${isActive 
          ? 'border-b-2 border-primary text-primary' 
          : 'text-gray-500 hover:text-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
    >
      {children}
    </button>
  );
}

// Присваиваем displayName для определения типа компонента
Tab.displayName = 'Tab';

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function TabPanel({ children, value, className = '' }: TabPanelProps) {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={`mt-4 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
} 