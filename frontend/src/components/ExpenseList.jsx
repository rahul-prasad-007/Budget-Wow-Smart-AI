import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  formatCurrency,
  formatDate,
} from "../utils/expenses";
import {
  getAllCategories,
  getCategoryIcon,
  getCategoryLabel,
  getCategoryColor,
  getCategoryBgColor,
} from "../utils/categories";
import { Trash2, Download, CalendarRange, ArrowDownUp, Tags, FileDown, History } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();
  const { currentUser } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [timePeriod, setTimePeriod] = useState("all");

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...getAllCategories().map((cat) => ({
      value: cat.id,
      label: `${getCategoryIcon(cat.id)} ${cat.label}`,
    })),
  ];

  const sortOptions = [
    { value: "date-desc", label: "Date: Newest First" },
    { value: "date-asc", label: "Date: Oldest First" },
    { value: "amount-desc", label: "Amount: Highest First" },
    { value: "amount-asc", label: "Amount: Lowest First" },
  ];

  const timePeriodOptions = [
    { value: "all", label: "All Time" },
    { value: "1", label: "Last 1 Month" },
    { value: "2", label: "Last 2 Months" },
    { value: "3", label: "Last 3 Months" },
    { value: "6", label: "Last 6 Months" },
    { value: "12", label: "Last 1 Year" },
  ];

  // Filter expenses by time period
  const getFilteredByTimePeriod = (expensesList) => {
    if (timePeriod === "all") {
      return expensesList;
    }

    const months = parseInt(timePeriod);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    return expensesList.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= cutoffDate;
    });
  };

  const categoryFilteredExpenses = expenses.filter(
    (expense) => categoryFilter === "all" || expense.category === categoryFilter
  );

  const filteredExpenses = getFilteredByTimePeriod(categoryFilteredExpenses);
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const formatCurrencyForPDF = (amount) => {
    return `Rs. ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleDownloadPDF = () => {
    if (sortedExpenses.length === 0) {
      toast.error("No expenses to download");
      return;
    }

    try {
      const doc = new jsPDF();
      const userName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";
      
      doc.setFontSize(18);
      doc.setTextColor(139, 92, 246);
      doc.text("Expense Statement", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`User: ${userName}`, 14, 30);
      
      const periodLabel = timePeriodOptions.find(opt => opt.value === timePeriod)?.label || "All Time";
      doc.text(`Period: ${periodLabel}`, 14, 36);
      
      const categoryLabel = categoryOptions.find(opt => opt.value === categoryFilter)?.label || "All Categories";
      doc.text(`Category: ${categoryLabel}`, 14, 42);
      
      if (sortedExpenses.length > 0) {
        const dates = sortedExpenses.map(e => new Date(e.date)).sort((a, b) => a - b);
        const startDate = formatDate(dates[0].toISOString().split("T")[0]);
        const endDate = formatDate(dates[dates.length - 1].toISOString().split("T")[0]);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 48);
      }
      
      const totalAmount = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Total Expenses: ${formatCurrencyForPDF(totalAmount)}`, 14, 58);
      doc.setFont(undefined, "normal");
      
      const tableData = sortedExpenses.map((expense) => [
        formatDate(expense.date),
        expense.description,
        expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
        formatCurrencyForPDF(expense.amount),
      ]);

      let finalY = 65;
      
      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          startY: 65,
          head: [["Date", "Description", "Category", "Amount"]],
          body: tableData,
          theme: "striped",
          headStyles: {
            fillColor: [139, 92, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            textAlign: "center",
          },
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 35, halign: "left" },
            1: { cellWidth: 75, halign: "left" },
            2: { cellWidth: 35, halign: "left" },
            3: { cellWidth: 40, halign: "right" },
          },
          margin: { left: 14, right: 14 },
        });

        finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 65 + (tableData.length * 10) + 10;
      } else {
        let yPos = 65;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("Date", 14, yPos);
        doc.text("Description", 54, yPos);
        doc.text("Category", 124, yPos);
        doc.text("Amount", 164, yPos);
        yPos += 8;
        
        doc.setFont(undefined, "normal");
        doc.setFontSize(9);
        tableData.forEach((row) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(row[0], 14, yPos);
          doc.text(row[1].substring(0, 25), 54, yPos);
          doc.text(row[2], 124, yPos);
          doc.text(row[3], 164, yPos);
          yPos += 7;
        });
        
        finalY = yPos + 5;
      }
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Total: ${formatCurrencyForPDF(totalAmount)}`, 14, finalY);
      doc.text(`Total Entries: ${sortedExpenses.length}`, 14, finalY + 8);
      
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        14,
        doc.internal.pageSize.height - 10
      );

      const fileName = `Expense_Statement_${userName}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="dash-list-section w-full">
      <div className="expense-history-header">
        <div className="expense-history-heading">
          <div className="expense-history-heading__icon" aria-hidden="true">
            <History size={20} strokeWidth={2.25} />
          </div>
          <div className="expense-history-heading__text">
            <h2 className="expense-history-title">
              <span className="expense-history-title__main">Expense</span>{" "}
              <span className="expense-history-title__accent">History</span>
            </h2>
            <p className="expense-history-title__sub">Track, filter & export your spending</p>
          </div>
        </div>
        <div className="expense-history-toolbar-card">
          <div className="expense-history-toolbar">
            <div className="expense-toolbar-field dash-select-field">
              <label htmlFor="expense-filter-period" className="expense-toolbar-label">
                <CalendarRange size={12} strokeWidth={2.5} />
                Period
              </label>
              <select
                id="expense-filter-period"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="dash-select dash-select--toolbar dash-select--cyan"
                aria-label="Filter by time period"
              >
                {timePeriodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="expense-toolbar-field dash-select-field">
              <label htmlFor="expense-filter-sort" className="expense-toolbar-label">
                <ArrowDownUp size={12} strokeWidth={2.5} />
                Sort By
              </label>
              <select
                id="expense-filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="dash-select dash-select--toolbar dash-select--violet"
                aria-label="Sort expenses"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="expense-toolbar-field dash-select-field">
              <label htmlFor="expense-filter-category" className="expense-toolbar-label">
                <Tags size={12} strokeWidth={2.5} />
                Category
              </label>
              <select
                id="expense-filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="dash-select dash-select--toolbar dash-select--indigo"
                aria-label="Filter by category"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="expense-toolbar-field expense-toolbar-field--action">
              <span className="expense-toolbar-label">
                <FileDown size={12} strokeWidth={2.5} />
                Export
              </span>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="expense-download-btn"
              >
                <span className="expense-download-btn__icon" aria-hidden="true">
                  <Download size={15} strokeWidth={2.25} />
                </span>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="dash-list-card expense-history-empty p-8 text-center text-gray-500">
          <p className="mb-2 font-semibold text-slate-600">No expenses found</p>
          {categoryFilter !== "all" && (
            <p className="text-sm">Try changing the category filter or add new expenses.</p>
          )}
        </div>
      ) : (
        <div className="dash-list-card accent-card accent-card--expense-list overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full dash-table expense-table">
              <thead className="dash-table-head expense-table-head">
                <tr>
                  <th scope="col" className="expense-th">Date</th>
                  <th scope="col" className="expense-th">Description</th>
                  <th scope="col" className="expense-th hidden sm:table-cell">Category</th>
                  <th scope="col" className="expense-th">Amount</th>
                  <th scope="col" className="expense-th expense-th--action">Action</th>
                </tr>
              </thead>
              <tbody className="dash-table-body expense-table-body">
                {sortedExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className="dash-table-row expense-table-row"
                    style={{
                      "--row-accent": getCategoryColor(expense.category),
                      animationDelay: `${Math.min(index * 0.04, 0.4)}s`,
                    }}
                  >
                    <td className="expense-td expense-td--date">
                      {formatDate(expense.date)}
                    </td>
                    <td className="expense-td expense-td--desc">
                      <span className="expense-desc-text block truncate max-w-[150px] sm:max-w-none">
                        {expense.description}
                      </span>
                      <span
                        className="expense-category-badge expense-category-badge--mobile sm:hidden mt-1.5"
                        style={{
                          "--cat-color": getCategoryColor(expense.category),
                          background: getCategoryBgColor(expense.category),
                        }}
                      >
                        <span className="expense-category-badge__icon">
                          {getCategoryIcon(expense.category)}
                        </span>
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="expense-td hidden sm:table-cell">
                      <span
                        className="expense-category-badge"
                        style={{
                          "--cat-color": getCategoryColor(expense.category),
                          background: getCategoryBgColor(expense.category),
                        }}
                      >
                        <span className="expense-category-badge__icon">
                          {getCategoryIcon(expense.category)}
                        </span>
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td
                      className="expense-td expense-td--amount"
                      style={{ color: getCategoryColor(expense.category) }}
                    >
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="expense-td expense-td--action">
                      <button
                        type="button"
                        onClick={() => handleDelete(expense.id)}
                        className="expense-delete-btn"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
