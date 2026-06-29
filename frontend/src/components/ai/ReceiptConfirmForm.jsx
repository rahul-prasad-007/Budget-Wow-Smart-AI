import {
  getAllCategories,
  getCategoryIcon,
  getCategoryLabel,
} from "../../utils/categories";
import { Sparkles } from "lucide-react";

const ReceiptConfirmForm = ({ data, onChange }) => {
  const categories = getAllCategories();
  const confidencePercent = Math.round((data.confidenceScore || 0) * 100);

  const fields = [
    { key: "merchantName", label: "Merchant Name", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "amount", label: "Amount (₹)", type: "number" },
    { key: "date", label: "Date", type: "date" },
    { key: "paymentMethod", label: "Payment Method", type: "text" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
        <div className="flex items-center gap-2 text-sm text-expense-dark">
          <Sparkles size={16} />
          <span>AI extracted — review before saving</span>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            confidencePercent >= 75
              ? "bg-green-100 text-green-700"
              : confidencePercent >= 50
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {confidencePercent}% confidence
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ key, label, type }) => (
          <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              step={type === "number" ? "0.01" : undefined}
              min={type === "number" ? "0" : undefined}
              value={data[key] ?? ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  [key]: type === "number" ? e.target.value : e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-expense-light text-sm"
            />
          </div>
        ))}

        <div className="sm:col-span-2 dash-select-field dash-select-field--block">
          <label htmlFor="receipt-category" className="dash-select-label dash-select-label--form">Category</label>
          <select
            id="receipt-category"
            value={data.suggestedCategory}
            onChange={(e) => onChange({ ...data, suggestedCategory: e.target.value })}
            className="dash-select dash-select--indigo"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getCategoryIcon(cat.id)} {getCategoryLabel(cat.id)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReceiptConfirmForm;
