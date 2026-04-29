export enum TransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
}

export interface Transaction {
    id: number;
    type: TransactionType;
    category: string;
    amount: number;
    date: string; // YYYY-MM-DD for simplicity
}

export interface FinancialAdvice {
    summary: string;
    forecast: string;
    tips: string[];
}

export interface Stock {
    symbol: string;
    name: string;
}

export interface StockData extends Stock {
    price: number;
    change: number;
    changePercent: number;
    lastPrice?: number;
}

export interface AppNotification {
    id: number;
    message: string;
    read: boolean;
    timestamp: string;
}
