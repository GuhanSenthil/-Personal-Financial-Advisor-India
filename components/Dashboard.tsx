import React from 'react';
import { Transaction, TransactionType } from '../types';
import FinancialChart from './FinancialChart';
import { ArrowDownIcon, ArrowUpIcon, CurrencyRupeeIcon } from './IconComponents';

interface DashboardProps {
    transactions: Transaction[];
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.type === TransactionType.INCOME;
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN');

    return (
        <li className="flex items-center justify-between py-3 px-4 hover:bg-base-200 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isIncome ? 
                        <ArrowUpIcon className="w-5 h-5 text-green-600" /> : 
                        <ArrowDownIcon className="w-5 h-5 text-red-600" />
                    }
                </div>
                <div>
                    <p className="font-semibold text-text-primary">{transaction.category}</p>
                    <p className="text-sm text-text-secondary">{formattedDate}</p>
                </div>
            </div>
            <p className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                {isIncome ? '+' : '-'} ₹{transaction.amount.toLocaleString('en-IN')}
            </p>
        </li>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100"><ArrowUpIcon className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-text-secondary">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                    <div className="p-3 rounded-full bg-red-100"><ArrowDownIcon className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-sm text-text-secondary">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100"><CurrencyRupeeIcon className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-text-secondary">Net Balance</p>
                        <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            ₹{netBalance.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                 <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Overview</h3>
                <div className="h-80">
                    <FinancialChart transactions={transactions} />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Recent Transactions</h3>
                {transactions.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)}
                    </ul>
                ) : (
                    <p className="text-center text-text-secondary py-8">No transactions yet. Add one to get started!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;