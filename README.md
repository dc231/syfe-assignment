# Syfe Savings Planner 

A lightweight, client-side application to track financial goals and visualize progress. Built as a Frontend Intern assignment for Syfe.

##  Features

* **Goal Management**: Create multiple savings goals with custom targets.
* **Multi-Currency Support**: seamless handling of **USD** and **INR** goals.
* **Smart Dashboard**: Aggregates all goals into a single "Financial Overview" converted to the base currency (INR).
* **Live Exchange Rates**: Real-time fetching of USD-to-INR rates via API.
* **Progress Tracking**: Visual progress bars and percentage calculation for every contribution.
* **Responsive Design**: optimized for both desktop and mobile screens.

## Tech Stack

* **Framework**: React 18 (via Vite)
* **Language**: TypeScript (Strict Mode)
* **Styling**: CSS Modules (Scoped styling, no external UI libraries used)
* **State Management**: React Hooks (useState, useMemo, custom hooks)
* **Icons/Utils**: `uuid` for unique ID generation.

## Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd syfe-savings-planner
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## Design Decisions & Trade-offs

### 1. CSS Modules over Tailwind/UI Libraries
[cite_start]To adhere to the requirement of not using component libraries (MUI/ChakraUI)[cite: 34], I chose **CSS Modules**. This offers:
* **Modularity**: Styles are locally scoped to components, preventing global namespace pollution.
* **Readability**: Clear separation between logic (`.tsx`) and presentation (`.css`).

### 2. Custom `useExchangeRate` Hook
I extracted the API logic into a custom hook (`src/hooks/useExchangeRate.ts`). This separates the **data fetching layer** from the **UI layer**, making the components cleaner and easier to test. It handles:
* Fetching from `open.er-api.com`.
* Loading and Error states.
* Caching (API allows 1.5k requests, but we only fetch on mount or manual refresh).

### 3. Currency Normalization
The Dashboard aggregates totals. Since goals can be mixed (some USD, some INR), the app normalizes everything to **INR** for the summary view using the live exchange rate. This ensures the "Total Saved" metric is always accurate regardless of currency fluctuations.

---
*Built with ❤️ by Dheeraj Chaudhary*