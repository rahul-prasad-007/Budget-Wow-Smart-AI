import React from "react";
import { ExpenseProvider } from "../context/ExpenseContext";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardComponent from "../components/Dashboard";

/**
 * Dashboard Page Component
 * 
 * This is the main dashboard page wrapper that:
 * - Provides ExpenseContext to all child components
 * - Wraps content with DashboardLayout (header, footer, navigation)
 * - Renders the actual dashboard content (DashboardComponent)
 * 
 * Structure:
 * ExpenseProvider -> DashboardLayout -> DashboardComponent
 */
const Dashboard = () => {
  return (
    <ExpenseProvider>
      <DashboardLayout>
        <DashboardComponent />
      </DashboardLayout>
    </ExpenseProvider>
  );
};

export default Dashboard;
