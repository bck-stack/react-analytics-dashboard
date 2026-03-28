import { useState } from "react";
import KpiCard from "./components/KpiCard";
import OrdersTable from "./components/OrdersTable";
import RevenueChart from "./components/RevenueChart";
import TopProductsTable from "./components/TopProductsTable";
import { useKpis, useRecentOrders, useTimeSeries, useTopProducts } from "./hooks/useMetrics";

const RANGE_OPTIONS = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
];

export default function App() {
  const [range, setRange] = useState(30);

  const { data: kpis, isLoading: kpisLoading } = useKpis();
  const { data: timeSeries, isLoading: tsLoading } = useTimeSeries(range);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts();
  const { data: orders, isLoading: ordersLoading } = useRecentOrders();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time business metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                range === opt.value
                  ? "bg-brand-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpisLoading
            ? Array.from({ length: 4 }).map((_, i) => <KpiCard key={i} card={{ label: "", value: "", change: 0 }} loading />)
            : kpis?.map((card) => <KpiCard key={card.label} card={card} />)}
        </div>

        {/* Revenue Chart */}
        <RevenueChart data={timeSeries ?? []} loading={tsLoading} />

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopProductsTable data={topProducts ?? []} loading={productsLoading} />
          <div className="rounded-2xl bg-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
              Users — Last {range} Days
            </h2>
            <div className="flex flex-col gap-2">
              {timeSeries?.slice(-7).map((point) => (
                <div key={point.date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 shrink-0">{point.date}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${(point.users / 400) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-8 text-right">{point.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable data={orders ?? []} loading={ordersLoading} />
      </main>

      <footer className="text-center text-xs text-gray-600 py-4 border-t border-gray-800">
        Analytics Dashboard — React + Recharts + TanStack Query
      </footer>
    </div>
  );
}
