export type Currency = 'USD' | 'INR';

export interface Contribution {
  id: string;
  amount: number;
  date: string; // ISO date string
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  contributions: Contribution[];
}