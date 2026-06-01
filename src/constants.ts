import { TimeOption, MainTab } from './types';

export const TIME_OPTIONS: TimeOption[] = ['Live', '1 Min', '5 Min', '10 Min', '15 Min', '30 Min', '45 Min', '1 Hour', '12 Hours', '1 Day', '1 Week', '1 Month'];
export const MAIN_TABS: MainTab[] = ['Technical', 'Commercials'];

export const COMMON_SUB_TABS = ['Top Countries', 'Top Products', 'Top Customers', 'Top Suppliers'];
export const TECHNICAL_SUB_ONLY = ['Supplier', 'Customer'];
export const COMMERCIAL_SUB_ONLY = ['Customers', 'Suppliers', 'Netting', 'Margin', 'Business'];

export const TECHNICAL_SUB_TABS = [...TECHNICAL_SUB_ONLY, ...COMMON_SUB_TABS];
export const COMMERCIAL_SUB_TABS = [...COMMERCIAL_SUB_ONLY, ...COMMON_SUB_TABS];

export const MOCK_COUNTRIES = [
  { name: 'India', value: 450000 },
  { name: 'USA', value: 320000 },
  { name: 'UK', value: 210000 },
  { name: 'UAE', value: 180000 },
  { name: 'Singapore', value: 150000 }
];

export const MOCK_PRODUCTS = [
  { name: 'OTP Service', value: 650000 },
  { name: 'Marketing SMS', value: 420000 },
  { name: 'Transactional', value: 380000 },
  { name: '2FA Auth', value: 290000 }
];

export const MOCK_CLIENTS = [
  { id: 'c1', name: 'Global Connect Ltd', status: 'connected', uptime: '99.98' },
  { id: 'c2', name: 'Skyline Telecom', status: 'connected', uptime: '99.95' },
  { id: 'c3', name: 'Nexus SMS Solutions', status: 'disconnected', uptime: '98.50' },
  { id: 'c4', name: 'Prime Communications', status: 'connected', uptime: '99.99' },
  { id: 'c5', name: 'Vortex Networks', status: 'connected', uptime: '99.90' }
];

export const MOCK_SUPPLIERS = [
  { id: 's1', name: 'Tata Communications', status: 'connected', uptime: '99.99' },
  { id: 's2', name: 'Airtel Global', status: 'connected', uptime: '99.97' },
  { id: 's3', name: 'Vodafone Carrier', status: 'connected', uptime: '99.98' },
  { id: 's4', name: 'Orange Wholesale', status: 'disconnected', uptime: '97.20' },
  { id: 's5', name: 'BICS Global', status: 'connected', uptime: '99.96' }
];
