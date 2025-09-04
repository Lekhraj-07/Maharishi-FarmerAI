
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  language: 'en' | 'hi' | 'mr';
  village: string;
  district: string;
  state: string;
  pincode: string;
  soilType: string;
  walletBalance: number;
}

export interface Crop {
  id: string;
  name: string;
  type: string;
  season: string;
  basePricePerKg: number;
}

export type ListingStatus = 'OPEN' | 'SOLD' | 'CANCELLED';

export interface Listing {
  id: string;
  crop: Crop;
  farmer: Farmer;
  quantityKg: number;
  askPricePerKg: number;
  status: ListingStatus;
  createdAt: string;
}

export interface WeatherSnapshot {
  pincode: string;
  date: string;
  temperatureC: number;
  rainfallMm: number;
  humidity: number;
  windKph: number;
  forecast: string;
}

export interface CropRecommendation {
  crop: string;
  reason: string;
  expectedYieldKgPerAcre: string;
  expectedProfitInr: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
