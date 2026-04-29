import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, FinancialAdvice, Stock, StockData, AppNotification } from './types';
import { getFinancialAdvice } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';
import SuggestionsPanel from './components/SuggestionsPanel';
import InvestmentsDashboard from './components/InvestmentsDashboard';
import SIPCalculator from './components/SIPCalculator';
import { initialTransactions, initialWatchlist, availableStocks } from './constants';
import { PlusCircleIcon, ChartPieIcon, BriefcaseIcon, CalculatorIcon } from './components/IconComponents';

type Tab = 'overview' | 'investments' | 'calculator';

// Helper function to generate initial mock data for stocks
const generateInitialStockData = (watchlist: Stock[]): StockData[] => {
    return watchlist.map(stock => {
        const price = parseFloat((Math.random() * (4000 - 500) + 500).toFixed(2));
        return {
            ...stock,
            price,
            change: 0,
            changePercent: 0,
            lastPrice: price,
        };
    });
};

const App: React.FC = () => {
    // Financial Overview State
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
    const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(true);
    const [adviceError, setAdviceError] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    // New Features State
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [watchlist, setWatchlist] = useState<Stock[]>(initialWatchlist);
    const [stockData, setStockData] = useState<StockData[]>(generateInitialStockData(initialWatchlist));
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
        setIsFormVisible(false);
    };

    const fetchAdvice = useCallback(async () => {
        if (transactions.length === 0) {
            setAdvice(null);
            setIsLoadingAdvice(false);
            return;
        }
        
        setIsLoadingAdvice(true);
        setAdviceError(null);
        try {
            const result = await getFinancialAdvice(transactions, "Help me improve my budget for next month.");
            setAdvice(result);
        } catch (err) {
            console.error(err);
            setAdviceError('Failed to fetch financial advice. The advisor might be busy. Please try again later.');
        } finally {
            setIsLoadingAdvice(false);
        }
    }, [transactions]);

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchAdvice();
        }
    }, [fetchAdvice, activeTab]);

    // Simulate stock market updates and generate notifications
    useEffect(() => {
        const stockUpdateInterval = setInterval(() => {
            setStockData(currentStockData => {
                return currentStockData.map(stock => {
                    const changePercent = (Math.random() - 0.5) * 0.05; // Max 5% change
                    const newPrice = Math.max(10, stock.price * (1 + changePercent)); // Ensure price doesn't go below 10
                    const change = newPrice - (stock.lastPrice ?? stock.price);
                    
                    // Generate notification for significant changes
                    if (Math.abs(changePercent) > 0.03) { // 3% threshold
                         const message = `${stock.symbol} price has changed by ${changePercent > 0 ? '+' : ''}${(changePercent * 100).toFixed(2)}% to ₹${newPrice.toFixed(2)}.`;
                         setNotifications(prev => {
                            if (prev.some(n => n.message === message)) return prev; // Avoid duplicate notifications
                            const newNotification: AppNotification = {
                                id: Date.now(),
                                message,
                                read: false,
                                timestamp: new Date().toISOString()
                            };
                            return [newNotification, ...prev].slice(0, 10); // Keep last 10 notifications
                         });
                    }

                    return { ...stock, price: newPrice, change, changePercent };
                });
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(stockUpdateInterval);
    }, []); // Interval is set once on mount and cleared on unmount

    const handleAddToWatchlist = (stockSymbol: string) => {
        if (watchlist.find(s => s.symbol === stockSymbol)) return;
        const stockToAdd = availableStocks.find(s => s.symbol === stockSymbol);
        if (stockToAdd) {
            setWatchlist(prev => [...prev, stockToAdd]);
            setStockData(prev => [...prev, ...generateInitialStockData([stockToAdd])]);
        }
    };

    const handleRemoveFromWatchlist = (stockSymbol: string) => {
        setWatchlist(prev => prev.filter(s => s.symbol !== stockSymbol));
        setStockData(prev => prev.filter(s => s.symbol !== stockSymbol));
    };
    
    const markNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'investments':
                return <InvestmentsDashboard 
                            watchlist={watchlist}
                            stockData={stockData}
                            onAdd={handleAddToWatchlist}
                            onRemove={handleRemoveFromWatchlist}
                        />;
            case 'calculator':
                return <SIPCalculator />;
            case 'overview':
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Dashboard transactions={transactions} />
                            {isFormVisible ? (
                               <InputForm onAddTransaction={handleAddTransaction} onCancel={() => setIsFormVisible(false)} />
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsFormVisible(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        aria-label="Add new transaction"
                                    >
                                        <PlusCircleIcon className="w-6 h-6" />
                                        Add Transaction
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                           <SuggestionsPanel 
                              advice={advice} 
                              isLoading={isLoadingAdvice} 
                              error={adviceError}
                              onRefresh={fetchAdvice}
                            />
                        </div>
                    </div>
                );
        }
    };

    const TabButton: React.FC<{tab: Tab, label: string, icon: React.ReactNode}> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${activeTab === tab ? 'bg-primary text-white' : 'text-text-secondary hover:bg-base-200'}`}
            aria-current={activeTab === tab ? 'page' : undefined}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-base-100 text-text-primary">
            <Header notifications={notifications} onClearNotifications={markNotificationsAsRead} />
            <main className="p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Tab Navigation */}
                    <div className="mb-8 p-1.5 bg-white rounded-lg shadow-sm inline-flex items-center gap-2">
                        <TabButton tab="overview" label="Overview" icon={<ChartPieIcon className="w-5 h-5"/>}/>
                        <TabButton tab="investments" label="Investments" icon={<BriefcaseIcon className="w-5 h-5"/>}/>
                        <TabButton tab="calculator" label="SIP Calculator" icon={<CalculatorIcon className="w-5 h-5"/>}/>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;