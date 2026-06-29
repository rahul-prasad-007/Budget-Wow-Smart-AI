import React, { useState } from "react";
import { formatCurrency } from "../utils/expenses";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = [
  ["#818CF8", "#6366F1"],
  ["#22D3EE", "#06B6D4"],
  ["#C084FC", "#A855F7"],
  ["#2DD4BF", "#14B8A6"],
  ["#4ADE80", "#22C55E"],
  ["#FB923C", "#F97316"],
  ["#F472B6", "#EC4899"],
  ["#94A3B8", "#64748B"],
];

const ExpenseBarChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      amount: value,
    }))
    .reverse();

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No expense data to display
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="dash-chart-tooltip">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-lg font-bold text-indigo-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-chart-container dash-chart-container--tall w-full">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 12, left: 4, bottom: 50 }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <defs>
          {chartData.map((entry, index) => {
            const [light, dark] = BAR_COLORS[index % BAR_COLORS.length];
            return (
              <linearGradient key={entry.name} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(99, 102, 241, 0.12)" />
        <XAxis
          dataKey="name"
          angle={-40}
          textAnchor="end"
          height={56}
          tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
          axisLine={{ stroke: "rgba(148, 163, 184, 0.4)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => `₹${value}`}
          tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.08)", radius: 8 }} />
        <Bar
          dataKey="amount"
          radius={[10, 10, 0, 0]}
          animationDuration={1200}
          animationBegin={0}
          animationEasing="ease-out"
          maxBarSize={52}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={`url(#barGrad-${index})`}
              stroke={activeIndex === index ? "#4f46e5" : "transparent"}
              strokeWidth={activeIndex === index ? 2 : 0}
              style={{
                cursor: "pointer",
                filter: activeIndex === index ? "drop-shadow(0 8px 16px rgba(99, 102, 241, 0.35))" : "none",
                transition: "filter 0.2s ease",
              }}
              onMouseEnter={() => setActiveIndex(index)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBarChart;
