
import React, { useState } from 'react';
import { MOCK_FARMER, MOCK_LISTINGS } from '../constants';
import type { Listing, ListingStatus, WeatherSnapshot } from '../types';
import { Card } from '../components/ui';
import { LeafIcon, SunIcon, CloudIcon, WindIcon } from '../components/Icons';

// Dashboard Page
export const DashboardPage: React.FC = () => {
    const farmerListings = MOCK_LISTINGS.filter(l => l.farmer.id === MOCK_FARMER.id);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {MOCK_FARMER.name}!</h1>

            <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
                <p className="text-4xl font-bold">₹{MOCK_FARMER.walletBalance.toLocaleString('en-IN')}</p>
                <p className="text-primary-200 mt-1">Ready for your next transaction.</p>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Listings</h2>
                <div className="space-y-4">
                    {farmerListings.length > 0 ? farmerListings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    )) : <p>You have no active listings.</p>}
                </div>
            </div>
        </div>
    );
};

// Marketplace Page
export const MarketplacePage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
                <p className="text-gray-600 mt-1">Browse fresh produce directly from farmers.</p>
            </div>
            {/* Add filter controls here in a real app */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_LISTINGS.filter(l => l.status === 'OPEN').map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => {
    const statusStyles = {
        OPEN: 'bg-green-100 text-green-800',
        SOLD: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
}

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-primary-800">{listing.crop.name}</h3>
                <p className="text-sm text-gray-500">{listing.crop.type}</p>
            </div>
            <StatusBadge status={listing.status} />
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Price:</span> ₹{listing.askPricePerKg}/kg</p>
            <p><span className="font-semibold">Quantity:</span> {listing.quantityKg} kg</p>
            <p><span className="font-semibold">Farmer:</span> {listing.farmer.name}, {listing.farmer.village}</p>
        </div>
        {listing.status === 'OPEN' && (
            <button className="mt-4 w-full bg-secondary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-600 transition-colors">
                Place Order
            </button>
        )}
    </Card>
);

// Weather Page
export const WeatherPage: React.FC = () => {
    const [pincode, setPincode] = useState('261001');
    const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setWeather({
                pincode,
                date: new Date().toLocaleDateString(),
                temperatureC: 32,
                rainfallMm: 5,
                humidity: 75,
                windKph: 12,
                forecast: "Partly cloudy with a chance of afternoon showers. High temperatures will continue.",
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Weather Information</h1>
            <Card>
                <form onSubmit={fetchWeather} className="flex items-end space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Enter Pincode</label>
                        <input
                            id="pincode"
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., 261001"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
                        {loading ? 'Fetching...' : 'Get Weather'}
                    </button>
                </form>
            </Card>

            {loading && <p className="text-center">Loading weather data...</p>}
            {weather && !loading && (
                <Card className="bg-blue-50">
                    <h2 className="text-2xl font-bold text-blue-800">Weather for Pincode: {weather.pincode}</h2>
                    <p className="text-sm text-blue-600">As of {weather.date}</p>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <SunIcon className="w-8 h-8 mx-auto text-yellow-500" />
                            <p className="mt-2 text-2xl font-bold">{weather.temperatureC}°C</p>
                            <p className="text-sm text-gray-500">Temperature</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <CloudIcon className="w-8 h-8 mx-auto text-blue-500" />
                            <p className="mt-2 text-2xl font-bold">{weather.rainfallMm} mm</p>
                            <p className="text-sm text-gray-500">Rainfall</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <LeafIcon className="w-8 h-8 mx-auto text-green-500" />
                            <p className="mt-2 text-2xl font-bold">{weather.humidity}%</p>
                            <p className="text-sm text-gray-500">Humidity</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <WindIcon className="w-8 h-8 mx-auto text-gray-500" />
                            <p className="mt-2 text-2xl font-bold">{weather.windKph} kph</p>
                            <p className="text-sm text-gray-500">Wind</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-blue-700">Forecast</h3>
                        <p className="text-gray-600">{weather.forecast}</p>
                    </div>
                </Card>
            )}
        </div>
    );
};
