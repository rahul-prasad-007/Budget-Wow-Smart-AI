import React from "react";
import { ExpenseProvider } from "../context/ExpenseContext";
import DashboardLayout from "../layouts/DashboardLayout";
import AIInsightsPanel from "../components/ai/AIInsightsPanel";

const AIInsights = () => {
  return (
    <ExpenseProvider>
      <DashboardLayout>
        <AIInsightsPanel />
      </DashboardLayout>
    </ExpenseProvider>
  );
};

export default AIInsights;
