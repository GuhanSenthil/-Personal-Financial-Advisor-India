import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { expenseCategories, incomeCategories } from '../constants';

interface InputFormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onCancel: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAddTransaction, onCancel }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !date) {
            setError('All fields are required.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be positive.');
            return;
        }
        setError('');
        onAddTransaction({
            type,
            amount: parseFloat(amount),
            category,
            date,
        });
        // Reset form
        setAmount('');
        setCategory('');
    };
    
    const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Add a New Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-base-200 p-1">
                    <button
                        type="button"
                        onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-white shadow' : 'text-text-secondary'}`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => { setType(TransactionType.INCOME); setCategory(''); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-white shadow' : 'text-text-secondary'}`}
                    >
                        Income
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="block w-full rounded-md border-gray-300 pl-7 pr-2 py-2 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    {/* Date */}
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-2"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-2"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex items-center justify-end gap-4 pt-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-base-200 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-secondary transition-colors">
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputForm;