
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { recommendCrops, AgriChat } from '../services/geminiService';
import type { CropRecommendation, ChatMessage } from '../types';
import { SOIL_TYPES, SEASONS } from '../constants';
import { Card, Button, Input, Select, Spinner } from '../components/ui';
import { BotIcon, UserIcon, SendIcon, LeafIcon } from '../components/Icons';

type ActiveTab = 'recommend' | 'chat';

const AIAssistantPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('recommend');

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Maharishi AI Assistant</h1>
            <p className="text-gray-600 mb-6">Your personal guide for smarter farming.</p>

            <div className="flex border-b border-gray-200 mb-6">
                <TabButton
                    label="Crop Recommendation"
                    isActive={activeTab === 'recommend'}
                    onClick={() => setActiveTab('recommend')}
                />
                <TabButton
                    label="Agri Q&A Chat"
                    isActive={activeTab === 'chat'}
                    onClick={() => setActiveTab('chat')}
                />
            </div>

            <div>
                {activeTab === 'recommend' && <CropRecommendationTool />}
                {activeTab === 'chat' && <AgriQAChat />}
            </div>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
            isActive
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
        {label}
    </button>
);

// Crop Recommendation Component
const CropRecommendationTool: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
    const pincodeRef = useRef<HTMLInputElement>(null);
    const soilTypeRef = useRef<HTMLSelectElement>(null);
    const seasonRef = useRef<HTMLSelectElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendations([]);

        const pincode = pincodeRef.current?.value;
        const soilType = soilTypeRef.current?.value;
        const season = seasonRef.current?.value;

        if (!pincode || !soilType || !season) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const result = await recommendCrops(pincode, soilType, season);
            setRecommendations(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input ref={pincodeRef} id="pincode" label="Pincode" type="text" placeholder="e.g., 261001" required />
                    <Select ref={soilTypeRef} id="soilType" label="Soil Type" required>
                        <option value="">Select Soil</option>
                        {SOIL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                    <Select ref={seasonRef} id="season" label="Season" required>
                        <option value="">Select Season</option>
                        {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? <Spinner /> : 'Get Recommendations'}
                </Button>
            </form>
            
            {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

            {recommendations.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Here are your top recommendations:</h3>
                    {recommendations.map((rec, index) => (
                        <Card key={index} className="bg-primary-50">
                            <div className="flex items-center gap-4">
                               <LeafIcon className="w-8 h-8 text-primary-600"/>
                               <div>
                                  <h4 className="text-lg font-bold text-primary-800">{rec.crop}</h4>
                                   <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                               </div>
                            </div>
                           <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                               <p><strong className="block text-gray-500">Yield:</strong> {rec.expectedYieldKgPerAcre}</p>
                               <p><strong className="block text-gray-500">Profit:</strong> {rec.expectedProfitInr}</p>
                           </div>
                        </Card>
                    ))}
                </div>
            )}
        </Card>
    );
};


// Agri Q&A Chat Component
const AgriQAChat: React.FC = () => {
    const [chatService] = useState(() => new AgriChat());
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const initializeChat = useCallback(async () => {
        setIsLoading(true);
        const stream = await chatService.sendMessageStream("Hello"); // Initial greeting
        let responseText = '';
        for await (const chunk of stream) {
            responseText += chunk.text;
        }
        setMessages([{ role: 'model', text: responseText }]);
        setIsLoading(false);
    }, [chatService]);
    
    useEffect(() => {
        initializeChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const modelMessage: ChatMessage = { role: 'model', text: '' };
        setMessages(prev => [...prev, modelMessage]);

        try {
            const stream = await chatService.sendMessageStream(input);
            let currentText = '';
            for await (const chunk of stream) {
                currentText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: currentText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: "Sorry, an error occurred." };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="flex flex-col h-[70vh]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <BotIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />}
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                           {isLoading && msg.role === 'model' && index === messages.length -1 && <span className="inline-block w-2 h-2 ml-1 bg-gray-500 rounded-full animate-pulse"></span>}
                        </div>
                        {msg.role === 'user' && <UserIcon className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />}
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about crops, soil, or pests..."
                        className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};


export default AIAssistantPage;
