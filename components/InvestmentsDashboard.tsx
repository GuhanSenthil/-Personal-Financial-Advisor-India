import React, { useState, useEffect, useMemo } from 'react';
import { Stock, StockData } from '../types';
import { availableStocks } from '../constants';
import { PlusCircleIcon, ArrowUpIcon, ArrowDownIcon, XMarkIcon } from './IconComponents';

interface InvestmentsDashboardProps {
    watchlist: Stock[];
    stockData: StockData[];
    onAdd: (symbol: string) => void;
    onRemove: (symbol: string) => void;
}

const MarketTicker: React.FC = () => {
    const [marketData, setMarketData] = useState([
        { name: 'NIFTY 50', value: 23501.10, change: 36.75 },
        { name: 'SENSEX', value: 77209.90, change: -29.92 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(data => data.map(item => {
                const randomChange = (Math.random() - 0.5) * 5;
                return { ...item, value: Math.max(0, item.value + randomChange), change: item.change + randomChange };
            }));
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex justify-around items-center">
            {marketData.map(item => {
                const isUp = item.change >= 0;
                return (
                    <div key={item.name} className="text-center">
                        <p className="text-sm font-semibold text-text-secondary">{item.name}</p>
                        <p className="text-xl font-bold text-text-primary">{item.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className={`flex items-center justify-center text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            {isUp ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                            <span>{item.change.toFixed(2)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const StockCard: React.FC<{ data: StockData; onRemove: (symbol: string) => void }> = ({ data, onRemove }) => {
    const isUp = data.change >= 0;
    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <div>
                <p className="text-lg font-bold text-text-primary">{data.symbol}</p>
                <p className="text-sm text-text-secondary truncate w-40">{data.name}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-text-primary">₹{data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className={`text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? '+' : ''}{data.change.toFixed(2)} ({isUp ? '+' : ''}{(data.changePercent * 100).toFixed(2)}%)
                </p>
            </div>
             <button onClick={() => onRemove(data.symbol)} className="ml-4 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors" aria-label={`Remove ${data.symbol}`}>
                <XMarkIcon className="w-5 h-5"/>
            </button>
        </div>
    );
};

const AddStockModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (symbol: string) => void, currentWatchlist: Stock[] }> = ({ isOpen, onClose, onAdd, currentWatchlist }) => {
    const [selectedStock, setSelectedStock] = useState('');

    const availableToAdd = useMemo(() => 
        availableStocks.filter(s => !currentWatchlist.some(ws => ws.symbol === s.symbol)),
        [currentWatchlist]
    );

    useEffect(() => {
        // Pre-select the first available stock when modal opens
        if (isOpen && availableToAdd.length > 0) {
            setSelectedStock(availableToAdd[0].symbol);
        }
    }, [isOpen, availableToAdd]);


    if (!isOpen) return null;

    const handleSubmit = () => {
        if(selectedStock) {
            onAdd(selectedStock);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-text-primary">Add Stock to Watchlist</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="space-y-4">
                     <p className="text-sm text-text-secondary">Select a stock from the list to add to your personalized watchlist.</p>
                     <select
                        value={selectedStock}
                        onChange={(e) => setSelectedStock(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-2"
                     >
                         <option value="" disabled>Select a stock</option>
                         {availableToAdd.length > 0 ? availableToAdd.map(stock => (
                            <option key={stock.symbol} value={stock.symbol}>{stock.name} ({stock.symbol})</option>
                         )) : (
                            <option disabled>All available stocks are in your watchlist</option>
                         )}
                     </select>
                     <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-base-200 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={!selectedStock} className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Add Stock</button>
                     </div>
                </div>
            </div>
        </div>
    );
};


const InvestmentsDashboard: React.FC<InvestmentsDashboardProps> = ({ watchlist, stockData, onAdd, onRemove }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const watchlistData = stockData.filter(sd => watchlist.some(w => w.symbol === sd.symbol));

    return (
        <div className="space-y-8">
            <MarketTicker />

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary">My Watchlist</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        Add Stock
                    </button>
                </div>
                {watchlistData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {watchlistData.map(data => (
                            <StockCard key={data.symbol} data={data} onRemove={onRemove} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-text-secondary">Your watchlist is empty.</p>
                        <p className="text-sm text-text-secondary">Click "Add Stock" to start tracking.</p>
                    </div>
                )}
            </div>
            
            <AddStockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={onAdd} currentWatchlist={watchlist}/>
        </div>
    );
};

export default InvestmentsDashboard;
