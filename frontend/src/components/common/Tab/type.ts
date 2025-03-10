export interface TabContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export interface ItemProps {
  id: string;
  children: React.ReactNode;
}

export interface ListProps {
  children: React.ReactNode;
  underline?: boolean;
}

export interface ListContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface PanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export interface ProviderProps {
  children: React.ReactNode;
  defaultTab: string;
  className?: string;
}