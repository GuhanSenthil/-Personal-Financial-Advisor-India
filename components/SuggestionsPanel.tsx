
import React from 'react';
import { FinancialAdvice } from '../types';
import { LightBulbIcon, SparklesIcon, ExclamationTriangleIcon, ArrowPathIcon } from './IconComponents';

interface SuggestionsPanelProps {
    advice: FinancialAdvice | null;
    isLoading: boolean;
    error: string | null;
    onRefresh: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <SparklesIcon className="w-12 h-12 text-primary animate-pulse" />
        <p className="mt-4 text-lg font-semibold text-text-secondary">Generating Smart Insights...</p>
        <p className="text-sm text-text-secondary">Analyzing your finances.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string, onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-700">Oops! Something went wrong.</p>
        <p className="mt-2 text-sm text-red-600">{message}</p>
        <button
            onClick={onRetry}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
            <ArrowPathIcon className="w-5 h-5"/>
            Retry
        </button>
    </div>
);

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ advice, isLoading, error, onRefresh }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full sticky top-8">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <LightBulbIcon className="w-7 h-7 text-accent" />
                    <h3 className="text-xl font-bold text-text-primary">Personal Financial Advisor</h3>
                 </div>
                 <button onClick={onRefresh} disabled={isLoading} className="p-1.5 text-text-secondary hover:text-primary rounded-full hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
                 </button>
            </div>

            <div className="space-y-6">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} onRetry={onRefresh} />}
                {!isLoading && !error && advice && (
                    <div className="space-y-5">
                        <div>
                            <h4 className="font-semibold text-text-secondary">Summary</h4>
                            <p className="text-text-primary mt-1">{advice.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-secondary">Forecast</h4>
                            <p className="text-text-primary mt-1">{advice.forecast}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-secondary">Smart Tips</h4>
                            <ul className="mt-2 space-y-2 list-inside">
                                {advice.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <SparklesIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                 {!isLoading && !error && !advice && (
                     <div className="text-center py-10">
                         <p className="text-text-secondary">Add some transactions to get your personalized financial advice.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default SuggestionsPanel;