import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CurrencyRupeeIcon, CalculatorIcon } from './IconComponents';

interface SIPResult {
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
}

const SIPCalculator: React.FC = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [annualRate, setAnnualRate] = useState<number>(12);
    const [timePeriod, setTimePeriod] = useState<number>(10);
    const [result, setResult] = useState<SIPResult | null>(null);

    useEffect(() => {
        const calculateSIP = () => {
            const i = annualRate / 12 / 100; // Monthly rate of interest
            const n = timePeriod * 12; // Number of months
            const P = monthlyInvestment;

            if (P > 0 && annualRate > 0 && timePeriod > 0) {
                const totalValue = P * (((Math.pow(1 + i, n)) - 1) / i) * (1 + i);
                const investedAmount = P * n;
                const estimatedReturns = totalValue - investedAmount;
                setResult({
                    investedAmount,
                    estimatedReturns,
                    totalValue,
                });
            } else {
                setResult(null);
            }
        };
        calculateSIP();
    }, [monthlyInvestment, annualRate, timePeriod]);


    const chartData = useMemo(() => {
        if (!result) return [];
        return [
            { name: 'Invested Amount', value: result.investedAmount },
            { name: 'Estimated Returns', value: result.estimatedReturns },
        ];
    }, [result]);

    const COLORS = ['#3B82F6', '#22C55E'];

    const formatCurrency = (value: number) => {
        return `₹${value.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-6 h-fit">
                <div className="flex items-center gap-3">
                    <CalculatorIcon className="w-7 h-7 text-primary"/>
                    <h3 className="text-xl font-bold text-text-primary">SIP Calculator</h3>
                </div>
                
                <div className="space-y-4 pt-4">
                    <div>
                        <label htmlFor="monthly-investment" className="block text-sm font-medium text-text-secondary">Monthly Investment (₹)</label>
                        <input
                            type="range"
                            id="monthly-investment"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={e => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="text-right font-semibold text-primary">{formatCurrency(monthlyInvestment)}</div>
                    </div>
                    <div>
                        <label htmlFor="annual-rate" className="block text-sm font-medium text-text-secondary">Expected Return Rate (% p.a.)</label>
                        <input
                            type="range"
                            id="annual-rate"
                            min="1"
                            max="30"
                            step="0.5"
                            value={annualRate}
                            onChange={e => setAnnualRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="text-right font-semibold text-primary">{annualRate}%</div>
                    </div>
                    <div>
                        <label htmlFor="time-period" className="block text-sm font-medium text-text-secondary">Time Period (Years)</label>
                        <input
                           type="range"
                           id="time-period"
                           min="1"
                           max="40"
                           value={timePeriod}
                           onChange={e => setTimePeriod(Number(e.target.value))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="text-right font-semibold text-primary">{timePeriod} Years</div>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-text-primary mb-4 text-center">Projected Growth</h3>
                {result ? (
                    <div className="flex flex-col items-center">
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend iconType="circle"/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full max-w-sm mt-6 space-y-3 text-center">
                             <div className="flex justify-between items-center py-2 border-b">
                                <p className="text-text-secondary">Invested Amount</p>
                                <p className="font-bold text-lg text-blue-600">{formatCurrency(result.investedAmount)}</p>
                            </div>
                             <div className="flex justify-between items-center py-2 border-b">
                                <p className="text-text-secondary">Estimated Returns</p>
                                <p className="font-bold text-lg text-green-600">{formatCurrency(result.estimatedReturns)}</p>
                            </div>
                             <div className="flex justify-between items-center py-2">
                                <p className="text-text-secondary text-lg">Total Value</p>
                                <p className="font-bold text-2xl text-primary">{formatCurrency(result.totalValue)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-text-secondary">Enter the values to see your potential wealth.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SIPCalculator;
