import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { getChartData, getExpensesByMonth } from "../utils/expenses";
import { BarChart, PieChart } from "lucide-react";
import ExpensePieChart from "./ExpensePieChart";
import ExpenseBarChart from "./ExpenseBarChart";

const ExpenseChart = () => {
  const { expenses } = useExpenses();
  const [chartType, setChartType] = useState("pie");

  const chartData = getChartData(expenses);
  const monthlyData = getExpensesByMonth(expenses);

  const toggleClass = (type) =>
    `dash-chart-toggle ${chartType === type ? "dash-chart-toggle--active" : ""}`;

  if (expenses.length === 0) {
    return (
      <div className="dash-chart-card text-center p-4 sm:p-6">
        <h2 className="dash-section-title mb-4">Expense Analytics</h2>
        <div className="flex justify-center mb-6 gap-2 sm:gap-3">
          <button type="button" onClick={() => setChartType("pie")} className={toggleClass("pie")}>
            <PieChart size={16} />
            <span>Pie Chart</span>
          </button>
          <button type="button" onClick={() => setChartType("bar")} className={toggleClass("bar")}>
            <BarChart size={16} />
            <span>Bar Chart</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-500">
          Add some expenses to see your spending analytics
        </p>
      </div>
    );
  }

  return (
    <div className="dash-chart-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
        <h2 className="dash-section-title">Expense Analytics</h2>
        <div className="flex justify-center sm:justify-end gap-2 sm:gap-3">
          <button type="button" onClick={() => setChartType("pie")} className={toggleClass("pie")}>
            <PieChart size={16} />
            <span>Pie Chart</span>
          </button>
          <button type="button" onClick={() => setChartType("bar")} className={toggleClass("bar")}>
            <BarChart size={16} />
            <span>Bar Chart</span>
          </button>
        </div>
      </div>

      <div className="dash-chart-wrap" key={chartType}>
        {chartType === "pie" ? (
          <ExpensePieChart data={chartData} />
        ) : (
          <ExpenseBarChart data={monthlyData} />
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
