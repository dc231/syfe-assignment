import React, { useState } from 'react';
import styles from './AddContributionModal.module.css';

interface AddContributionModalProps {
  isOpen: boolean;
  goalName: string;
  onClose: () => void;
  onConfirm: (amount: number, date: string) => void;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  goalName,
  onClose,
  onConfirm
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onConfirm(numAmount, date);
    
    // Reset fields
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Add Savings to "{goalName}"</h3>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Amount Saved</label>
            <input 
              type="number" 
              className={styles.input}
              placeholder="e.g. 5000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              step="any"
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input 
              type="date" 
              className={styles.input}
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};