# FinControl - Mini Fintech Dashboard

A modern personal finance tracker built with Next.js, TypeScript, and Tailwind CSS. The application allows users to manage their income and expenses, visualize spending patterns, and gain insights into their financial habits.

## Features
* Add income and expense transactions
* Categorize transactions
* View transaction history
* Filter transactions by category and date
* Dashboard summary showing:
  * Total Income
  * Total Expenses
  * Net Balance
  * Top Spending Category
* Spending analytics using charts
* Rule-based financial insights
* User-specific data storage using Local Storage
* Responsive design for desktop and mobile devices

## Tech Stack
* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts
* Local Storage

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyamahalingshetti/Finance-Tracker.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd Finance-Tracker
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

## Project Structure
```text
src/
├── app/
├── components/
├── hooks/
├── utils/
├── types/
└── data/
```

## Financial Insight Logic

The application generates simple rule-based insights such as:
* Highest spending category
* Expense-to-income ratio
* Monthly spending trends
* Savings observations

## Data Storage

Transaction data is stored locally in the browser using Local Storage. Each user's data is isolated using a unique storage key.

## Future Improvements
* Cloud database integration
* Authentication with Google OAuth
* Budget planning and alerts
* Export transactions to CSV
* Recurring transactions
* AI-powered spending recommendations

## Live Demo

Deployed URL: 

## Author

**Shreya S Mahalingshetti**
