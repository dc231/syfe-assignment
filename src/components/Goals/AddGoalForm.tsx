import React, { useState } from 'react';
import type { Currency } from '../../types';
import styles from './AddGoalForm.module.css';

interface AddGoalFormProps {
  onAddGoal: (name: string, target: number, currency: Currency) => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [currency, setCurrency] = useState<Currency>('INR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !target) return;
    
    const numTarget = parseFloat(target);
    if (isNaN(numTarget) || numTarget <= 0) {
      alert('Please enter a valid target amount greater than 0');
      return;
    }

    // Send data to parent
    onAddGoal(name, numTarget, currency);
    
    // Reset form
    setName('');
    setTarget('');
    setCurrency('INR');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>+ Create New Goal</h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        
        {/* Name Input */}
        <div className={styles.field}>
          <label className={styles.label}>Goal Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Trip to Japan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={30}
          />
        </div>

        {/* Target Amount Input */}
        <div className={styles.field}>
          <label className={styles.label}>Target Amount</label>
          <input
            type="number"
            className={styles.input}
            placeholder="50000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            min="1"
            step="any"
            required
          />
        </div>

        {/* Currency Selector */}
        <div className={styles.field}>
          <label className={styles.label}>Currency</label>
          <select 
            className={styles.select}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Add Goal
        </button>
      </form>
    </div>
  );
};