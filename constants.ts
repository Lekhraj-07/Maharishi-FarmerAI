
import type { Farmer, Crop, Listing } from './types';

export const SOIL_TYPES: string[] = [
  'Alluvial', 'Black', 'Red', 'Laterite', 'Arid', 'Forest', 'Peaty', 'Saline'
];

export const SEASONS: string[] = [
  'Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'
];

export const MOCK_FARMER: Farmer = {
  id: 'FARMER_001',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  language: 'hi',
  village: 'Rampur',
  district: 'Sitapur',
  state: 'Uttar Pradesh',
  pincode: '261001',
  soilType: 'Alluvial',
  walletBalance: 15250.75,
};

const MOCK_CROPS: Crop[] = [
    { id: 'C01', name: 'Wheat', type: 'Grain', season: 'Rabi', basePricePerKg: 20 },
    { id: 'C02', name: 'Rice (Paddy)', type: 'Grain', season: 'Kharif', basePricePerKg: 18 },
    { id: 'C03', name: 'Cotton', type: 'Fiber', season: 'Kharif', basePricePerKg: 60 },
    { id: 'C04', name: 'Sugarcane', type: 'Cash Crop', season: 'Annual', basePricePerKg: 3 },
    { id: 'C05', name: 'Soybean', type: 'Oilseed', season: 'Kharif', basePricePerKg: 45 },
    { id: 'C06', name: 'Tomato', type: 'Vegetable', season: 'All', basePricePerKg: 25 },
    { id: 'C07', name: 'Onion', type: 'Vegetable', season: 'Rabi', basePricePerKg: 30 },
];


export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'L001',
    crop: MOCK_CROPS[0],
    farmer: MOCK_FARMER,
    quantityKg: 500,
    askPricePerKg: 22,
    status: 'OPEN',
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: 'L002',
    crop: MOCK_CROPS[5],
    farmer: MOCK_FARMER,
    quantityKg: 250,
    askPricePerKg: 28,
    status: 'OPEN',
    createdAt: '2023-10-25T14:30:00Z',
  },
  {
    id: 'L003',
    crop: MOCK_CROPS[6],
    farmer: { ...MOCK_FARMER, name: 'Suresh Patel', pincode: '380001' },
    quantityKg: 1000,
    askPricePerKg: 35,
    status: 'OPEN',
    createdAt: '2023-10-26T11:00:00Z',
  },
    {
    id: 'L004',
    crop: MOCK_CROPS[1],
    farmer: { ...MOCK_FARMER, name: 'Meena Devi', pincode: '800001' },
    quantityKg: 800,
    askPricePerKg: 20,
    status: 'SOLD',
    createdAt: '2023-10-24T09:00:00Z',
  },
];
