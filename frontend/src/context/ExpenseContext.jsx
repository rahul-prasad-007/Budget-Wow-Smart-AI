import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { expenseApi } from "../api/client";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const fetchExpenses = useCallback(async () => {
    if (!currentUser) {
      setExpenses([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await expenseApi.getAll();
      if (currentUserRef.current) {
        setExpenses(data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setExpenses([]);
    setError(null);
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expense) => {
    const user = currentUserRef.current;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const created = await expenseApi.create(expense);
    setExpenses((prev) => [created, ...prev]);
    return created.id;
  };

  const deleteExpense = async (id) => {
    await expenseApi.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = async (expense) => {
    const { id, ...expenseData } = expense;
    const updated = await expenseApi.update(id, expenseData);
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const value = {
    expenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    updateExpense,
    refreshExpenses: fetchExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
