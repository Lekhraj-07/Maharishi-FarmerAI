
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import AIAssistantPage from './pages/AIAssistantPage';
import { DashboardPage, MarketplacePage, WeatherPage } from './pages/OtherPages';
import { Button, Card, Input } from './components/ui';
import { LeafIcon } from './components/Icons';

// Simple Login Page Component defined within App.tsx
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
        <Card className="max-w-sm w-full">
            <div className="text-center mb-6">
                 <LeafIcon className="w-12 h-12 text-primary-600 mx-auto" />
                <h1 className="text-2xl font-bold text-gray-800 mt-2">Maharishi</h1>
                <p className="text-gray-500">The Farmer's AI Companion</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
                <Input id="email" label="Email / Phone" type="text" placeholder="Enter your details" defaultValue="farmer@maharishi.dev" />
                <Input id="password" label="Password" type="password" placeholder="••••••••" defaultValue="password" />
                <Button type="submit" className="w-full">
                    Login
                </Button>
                <p className="text-center text-sm text-gray-500">
                    This is a demo. Click Login to continue.
                </p>
            </form>
        </Card>
    </div>
);

// Header component for navigation
const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClasses = "bg-primary-100 text-primary-700";
    const inactiveLinkClasses = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                         <LeafIcon className="w-8 h-8 text-primary-600" />
                        <span className="font-bold text-xl text-primary-800">Maharishi</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Dashboard</NavLink>
                        <NavLink to="/marketplace" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Marketplace</NavLink>
                        <NavLink to="/weather" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Weather</NavLink>
                        <NavLink to="/ai-assistant" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>AI Assistant</NavLink>
                    </div>
                     <Button variant="ghost" onClick={onLogout}>Logout</Button>
                </div>
            </nav>
        </header>
    );
}

// Main App Component
const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <HashRouter>
            <div className="min-h-screen bg-primary-50">
                <Header onLogout={() => setIsAuthenticated(false)} />
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/weather" element={<WeatherPage />} />
                        <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;
