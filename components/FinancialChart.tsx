import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface FinancialChartProps {
    transactions: Transaction[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ transactions }) => {
    const processDataForChart = () => {
        const monthlyData: { [key: string]: { month: string; income: number; expenses: number } } = {};

        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expenses: 0 };
            }
            if (t.type === TransactionType.INCOME) {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expenses += t.amount;
            }
        });

        return Object.values(monthlyData).sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    };

    const chartData = processDataForChart();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#4B5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4B5563', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip
                    cursor={{ fill: 'rgba(224, 242, 254, 0.5)' }}
                    contentStyle={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="income" fill="#22C55E" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default FinancialChart;