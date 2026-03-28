import clsx from "clsx";
import { useState } from "react";
import type { RecentOrder } from "../api/metrics";

interface Props {
  data: RecentOrder[];
  loading?: boolean;
}

const STATUS_STYLES: Record<RecentOrder["status"], string> = {
  completed: "bg-emerald-900 text-emerald-300",
  pending: "bg-yellow-900 text-yellow-300",
  cancelled: "bg-red-900 text-red-300",
};

export default function OrdersTable({ data, loading }: Props) {
  const [filter, setFilter] = useState<string>("");

  if (loading) {
    return <div className="rounded-2xl bg-gray-800 h-64 animate-pulse" />;
  }

  const filtered = filter
    ? data.filter(
        (o) =>
          o.customer.toLowerCase().includes(filter.toLowerCase()) ||
          o.product.toLowerCase().includes(filter.toLowerCase()) ||
          o.id.toLowerCase().includes(filter.toLowerCase())
      )
    : data;

  return (
    <div className="rounded-2xl bg-gray-800 p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Recent Orders
        </h2>
        <input
          type="text"
          placeholder="Search orders..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-sm text-gray-200 placeholder-gray-500 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-brand-500 w-48"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
              <th className="text-left pb-2 pr-4">ID</th>
              <th className="text-left pb-2 pr-4">Customer</th>
              <th className="text-left pb-2 pr-4">Product</th>
              <th className="text-right pb-2 pr-4">Amount</th>
              <th className="text-left pb-2 pr-4">Status</th>
              <th className="text-left pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                <td className="py-2.5 pr-4 text-gray-400 font-mono">{order.id}</td>
                <td className="py-2.5 pr-4 text-gray-200">{order.customer}</td>
                <td className="py-2.5 pr-4 text-gray-300 truncate max-w-[140px]">{order.product}</td>
                <td className="py-2.5 pr-4 text-right text-white font-medium">
                  ${order.amount.toLocaleString()}
                </td>
                <td className="py-2.5 pr-4">
                  <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2.5 text-gray-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-6 text-sm">No orders match your search.</p>
        )}
      </div>
    </div>
  );
}
