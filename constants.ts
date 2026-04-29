import { Transaction, TransactionType, Stock } from './types';

export const initialTransactions: Transaction[] = [
    { id: 1, type: TransactionType.INCOME, category: 'Salary', amount: 75000, date: '2024-07-01' },
    { id: 2, type: TransactionType.EXPENSE, category: 'Rent', amount: 20000, date: '2024-07-01' },
    { id: 3, type: TransactionType.EXPENSE, category: 'Groceries', amount: 8000, date: '2024-07-05' },
    { id: 4, type: TransactionType.EXPENSE, category: 'Utilities', amount: 3000, date: '2024-07-10' },
    { id: 5, type: TransactionType.EXPENSE, category: 'Transport', amount: 2500, date: '2024-07-12' },
    { id: 6, type: TransactionType.EXPENSE, category: 'Dining Out', amount: 4000, date: '2024-07-15' },
    { id: 7, type: TransactionType.INCOME, category: 'Freelance', amount: 10000, date: '2024-07-18' },
    { id: 8, type: TransactionType.EXPENSE, category: 'Entertainment', amount: 1500, date: '2024-07-22' },
    { id: 9, type: TransactionType.EXPENSE, category: 'Shopping', amount: 5000, date: '2024-07-25' },
];

export const expenseCategories: string[] = [
    'Rent', 'Groceries', 'Utilities', 'Transport', 'Dining Out', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'
];

export const incomeCategories: string[] = [
    'Salary', 'Freelance', 'Investment', 'Bonus', 'Other'
];

export const availableStocks: Stock[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
];

export const initialWatchlist: Stock[] = [
    availableStocks[0],
    availableStocks[1],
    availableStocks[3],
    availableStocks[6],
];
