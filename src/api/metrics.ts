/**
 * API functions + mock data fallback for metrics endpoints.
 * When VITE_USE_MOCK=true (default), returns realistic demo data.
 */
import { addDays, format, subDays } from "date-fns";
import apiClient from "./client";

export interface KpiCard {
  label: string;
  value: string;
  change: number; // percent
  unit?: string;
}

export interface TimeSeriesPoint {
  date: string;
  revenue: number;
  users: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

// ---------------------------------------------------------------------------
// Mock generators
// ---------------------------------------------------------------------------

function mockTimeSeries(days = 30): TimeSeriesPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - 1 - i), "MMM dd");
    return {
      date,
      revenue: Math.round(3000 + Math.random() * 4000 + i * 80),
      users: Math.round(120 + Math.random() * 200 + i * 3),
      orders: Math.round(40 + Math.random() * 60 + i * 1.5),
    };
  });
}

function mockKpis(): KpiCard[] {
  return [
    { label: "Total Revenue", value: "$142,580", change: 12.4, unit: "USD" },
    { label: "Active Users", value: "8,431", change: 7.2 },
    { label: "Orders Today", value: "312", change: -3.1 },
    { label: "Avg Order Value", value: "$89.40", change: 5.8, unit: "USD" },
  ];
}

function mockTopProducts(): TopProduct[] {
  return [
    { name: "Pro Subscription", sales: 1240, revenue: 62000 },
    { name: "Starter Plan", sales: 980, revenue: 29400 },
    { name: "Enterprise License", sales: 42, revenue: 42000 },
    { name: "Add-on Pack", sales: 620, revenue: 9300 },
    { name: "One-time Setup", sales: 88, revenue: 8800 },
  ];
}

function mockRecentOrders(): RecentOrder[] {
  const statuses: RecentOrder["status"][] = ["completed", "pending", "cancelled"];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: ["Alice M.", "Bob K.", "Carol S.", "David R.", "Eve T.", "Frank L.", "Grace P.", "Henry W."][i],
    product: ["Pro Subscription", "Starter Plan", "Add-on Pack", "Enterprise License"][i % 4],
    amount: Math.round(50 + Math.random() * 450),
    status: statuses[i % 3],
    date: format(subDays(new Date(), i), "MMM dd, yyyy"),
  }));
}

// ---------------------------------------------------------------------------
// Data fetchers — mock by default, real API when VITE_USE_MOCK=false
// ---------------------------------------------------------------------------

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

async function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchKpis(): Promise<KpiCard[]> {
  if (USE_MOCK) { await delay(); return mockKpis(); }
  const { data } = await apiClient.get("/metrics/kpis");
  return data;
}

export async function fetchTimeSeries(days = 30): Promise<TimeSeriesPoint[]> {
  if (USE_MOCK) { await delay(); return mockTimeSeries(days); }
  const { data } = await apiClient.get(`/metrics/timeseries?days=${days}`);
  return data;
}

export async function fetchTopProducts(): Promise<TopProduct[]> {
  if (USE_MOCK) { await delay(); return mockTopProducts(); }
  const { data } = await apiClient.get("/metrics/products");
  return data;
}

export async function fetchRecentOrders(): Promise<RecentOrder[]> {
  if (USE_MOCK) { await delay(); return mockRecentOrders(); }
  const { data } = await apiClient.get("/metrics/orders/recent");
  return data;
}
