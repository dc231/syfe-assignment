import React from 'react';
import type { Goal } from '../../types';
import styles from './GoalCard.module.css';

interface GoalCardProps {
  goal: Goal;
  exchangeRate: number; // 1 USD = X INR
  onAddContribution: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  exchangeRate, 
  onAddContribution 
}) => {
  // 1. Calculate Total Saved for this specific goal
  const totalSaved = goal.contributions.reduce((sum, c) => sum + c.amount, 0);
  
  // 2. Calculate Progress Percentage
  const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

  // 3. Helper to format currency
  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 4. Conversion Logic for Display
  // If goal is USD, we show USD as main, INR as sub.
  // If goal is INR, we show INR as main, USD as sub.
  const isUSD = goal.currency === 'USD';
  
  const convertedTarget = isUSD 
    ? goal.targetAmount * exchangeRate 
    : goal.targetAmount / exchangeRate;

//   const convertedSaved = isUSD
//     ? totalSaved * exchangeRate
//     : totalSaved / exchangeRate;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{goal.name}</h3>
        <span className={styles.currencyTag}>{goal.currency}</span>
      </div>

      <div className={styles.amountSection}>
        {/* Main Amount (Original Currency) */}
        <span className={styles.mainAmount}>
          Target: {formatMoney(goal.targetAmount, goal.currency)}
        </span>
        
        {/* Converted Amount (Reference) */}
        <span className={styles.subAmount}>
          (~ {formatMoney(convertedTarget, isUSD ? 'INR' : 'USD')})
        </span>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressLabels}>
          <span>Saved: {formatMoney(totalSaved, goal.currency)}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        {/* Display remaining amount */}
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
           Left: {formatMoney(goal.targetAmount - totalSaved, goal.currency)}
        </div>
      </div>

      <button 
        className={styles.addBtn}
        onClick={() => onAddContribution(goal.id)}
      >
        + Add Contribution
      </button>
    </div>
  );
};