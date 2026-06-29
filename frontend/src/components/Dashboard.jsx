import React from "react";
import { Sparkles, ScanLine, Brain } from "lucide-react";
import ExpenseSummary from "./ExpenseSummary";
import ExpenseChart from "./ExpenseChart";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import BudgetLimitSettings from "./BudgetLimitSettings";

const Dashboard = () => {
  return (
    <div className="dash-page space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="dash-hero-card dash-animate-in">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="ai-badge text-xs"><Sparkles size={10} /> AI-Powered Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Welcome to your <span className="ai-gradient-text">Smart Finance Hub</span>
          </h2>
          <p className="text-gray-600 text-sm mt-2 flex flex-wrap gap-3">
            <span className="dash-hero-pill"><ScanLine size={14} /> Scan receipts</span>
            <span className="dash-hero-pill"><Brain size={14} /> AI insights</span>
            <span className="dash-hero-pill">Manual tracking</span>
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-center">
          <BudgetLimitSettings />
        </div>
      </div>

      <div className="dash-animate-in dash-animate-in--delay-1">
        <ExpenseSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 dash-animate-in dash-animate-in--delay-2">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <div>
          <ExpenseForm />
        </div>
      </div>

      <div className="dash-animate-in dash-animate-in--delay-3">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Dashboard;
