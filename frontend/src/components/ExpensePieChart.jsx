import React, { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

const CATEGORY_COLORS = {
  Food: "#6366F1",
  Transport: "#06B6D4",
  Entertainment: "#A855F7",
  Utilities: "#14B8A6",
  Health: "#22C55E",
  Shopping: "#F97316",
  Other: "#64748B",
};

const CHART_PALETTE = ["#6366F1", "#06B6D4", "#A855F7", "#14B8A6", "#22C55E", "#F97316", "#EC4899", "#64748B"];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="#ffffff"
      strokeWidth={3}
      style={{ filter: "drop-shadow(0 6px 14px rgba(15, 23, 42, 0.22))" }}
    />
  );
};

const ExpensePieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No expense data to display
      </div>
    );
  }

  const getColor = (name, index) => CATEGORY_COLORS[name] || CHART_PALETTE[index % CHART_PALETTE.length];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(0);

      return (
        <div className="dash-chart-tooltip">
          <p className="font-semibold text-slate-800">{name}</p>
          <p className="text-lg font-bold text-indigo-600">
            ₹{value.toFixed(2)}
            <span className="text-sm font-medium text-slate-500 ml-1">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-chart-container dash-chart-container--tall w-full">
      <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="48%"
          innerRadius="48%"
          outerRadius="72%"
          paddingAngle={4}
          dataKey="value"
          animationDuration={1100}
          animationBegin={0}
          animationEasing="ease-out"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={getColor(entry.name, index)}
              stroke="#ffffff"
              strokeWidth={2}
              style={{ cursor: "pointer" }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          formatter={(value) => (
            <span className="text-xs sm:text-sm font-semibold text-slate-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
