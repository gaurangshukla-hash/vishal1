export type TimeOption = 'Live' | '1 Min' | '5 Min' | '10 Min' | '15 Min' | '30 Min' | '45 Min' | '1 Hour' | '12 Hours' | '1 Day' | '1 Week' | '1 Month';
export type MainTab = 'Technical' | 'Commercials';
export type TechnicalSubTab = 'Supplier' | 'Customer' | 'Top Countries' | 'Top Products' | 'Top Customers' | 'Top Suppliers';
export type CommercialSubTab = 'Customers' | 'Suppliers' | 'Netting' | 'Margin' | 'Business' | 'Wholesale' | 'Top Countries' | 'Top Products' | 'Top Customers' | 'Top Suppliers';

export type UserRole = 'Admin' | 'SalesHead' | 'SalesExecutive' | 'NOC';
export type MenuOption = 'Dashboard' | 'Enterprise' | 'Finance' | 'Rate' | 'Routing' | 'Product' | 'SMS Services' | 'Report' | 'Admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface DashboardState {
  time: TimeOption;
  mainTab: MainTab;
  technicalSubTab: TechnicalSubTab;
  commercialSubTab: CommercialSubTab;
  theme: 'light' | 'dark';
  user: User | null;
  selectedExecutiveId?: string; // For SalesHead
  currentMenu: string;
}
