// src/App.tsx
import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './App.module.css';

// Components
import { DashboardSummary } from './components/Dashboard/DashboardSummary';
import { GoalCard } from './components/Goals/GoalCard';
import { AddGoalForm } from './components/Goals/AddGoalForm';
import { AddContributionModal } from './components/Shared/AddContributionModal';

// Hooks & Types
import { useExchangeRate } from './hooks/useExchangeRate';
import type { Goal, Currency } from './types';

function App() {
  // 1. Global State
  const { rate, loading, lastUpdated, refetch } = useExchangeRate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // 2. Logic: Create a new Goal
  const handleAddGoal = (name: string, targetAmount: number, currency: Currency) => {
    const newGoal: Goal = {
      id: uuidv4(),
      name,
      targetAmount,
      currency,
      contributions: []
    };
    setGoals(prev => [newGoal, ...prev]); // Add to top of list
  };

  // 3. Logic: Prepare Modal
  const openContributionModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsModalOpen(true);
  };

  // 4. Logic: Save Contribution
  const handleAddContribution = (amount: number, date: string) => {
    if (!selectedGoalId) return;

    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === selectedGoalId) {
        return {
          ...goal,
          contributions: [
            ...goal.contributions,
            { id: uuidv4(), amount, date }
          ]
        };
      }
      return goal;
    }));

    setIsModalOpen(false);
    setSelectedGoalId(null);
  };

  // 5. Logic: Dashboard Calculations (Memoized for performance)
  // We convert everything to INR for the global summary
  const summary = useMemo(() => {
    let totalTargetINR = 0;
    let totalSavedINR = 0;

    goals.forEach(goal => {
      const saved = goal.contributions.reduce((sum, c) => sum + c.amount, 0);
      
      // Conversion Logic
      if (goal.currency === 'USD') {
        totalTargetINR += goal.targetAmount * rate;
        totalSavedINR += saved * rate;
      } else {
        totalTargetINR += goal.targetAmount;
        totalSavedINR += saved;
      }
    });

    const overallProgress = totalTargetINR > 0 
      ? (totalSavedINR / totalTargetINR) * 100 
      : 0;

    return { totalTargetINR, totalSavedINR, overallProgress };
  }, [goals, rate]);

  // Find the name of the goal currently being edited (for the modal title)
  const selectedGoalName = goals.find(g => g.id === selectedGoalId)?.name || '';

  return (
    <div className="app-container">
      {/* Top Banner */}
      <DashboardSummary
        totalTarget={summary.totalTargetINR}
        totalSaved={summary.totalSavedINR}
        overallProgress={summary.overallProgress}
        lastUpdated={lastUpdated}
        onRefresh={refetch}
        loading={loading}
      />

      {/* Input Form */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Your Goals</h2>
        <button 
          onClick={() => setShowAddGoal(!showAddGoal)}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {showAddGoal ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {/* Conditionally show the form */}
      {showAddGoal && (
        <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <AddGoalForm onAddGoal={(name, target, curr) => {
            handleAddGoal(name, target, curr);
            setShowAddGoal(false); // Close form after adding
          }} />
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No goals yet </h3>
          <p>Create your first financial goal above to get started.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              exchangeRate={rate}
              onAddContribution={openContributionModal}
            />
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <AddContributionModal
        isOpen={isModalOpen}
        goalName={selectedGoalName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddContribution}
      />
    </div>
  );
}

export default App;