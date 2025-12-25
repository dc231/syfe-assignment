import React from 'react';
import styles from './DashboardSummary.module.css';

interface DashboardProps {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
  lastUpdated: string;
  onRefresh: () => void;
  loading: boolean;
}

export const DashboardSummary: React.FC<DashboardProps> = ({ 
  totalTarget, 
  totalSaved, 
  overallProgress,
  lastUpdated,
  onRefresh,
  loading
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
           Financial Overview
        </h2>
        <button 
          onClick={onRefresh} 
          className={styles.refreshBtn}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Refresh Rates ↻'}
        </button>
      </div>

      <div className={styles.statsGrid}>
        {/* Total Target */}
        <div className={styles.statItem}>
          <span className={styles.label}>Total Target (INR)</span>
          <span className={styles.value}>
            ₹{totalTarget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
        
        {/* Total Saved */}
        <div className={styles.statItem}>
          <span className={styles.label}>Total Saved (INR)</span>
          <span className={styles.value}>
            ₹{totalSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Overall Progress */}
        <div className={styles.statItem}>
          <span className={styles.label}>Overall Progress</span>
          <span className={styles.value}>
            {overallProgress.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
             Total goals completion
          </span>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span>Currency: INR (Base)</span>
        <span>Last updated: {lastUpdated}</span>
      </div>
    </div>
  );
};