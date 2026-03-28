/**
 * React Query hooks for all dashboard data.
 */
import { useQuery } from "@tanstack/react-query";
import {
  fetchKpis,
  fetchRecentOrders,
  fetchTimeSeries,
  fetchTopProducts,
} from "../api/metrics";

export const useKpis = () =>
  useQuery({ queryKey: ["kpis"], queryFn: fetchKpis });

export const useTimeSeries = (days: number) =>
  useQuery({ queryKey: ["timeseries", days], queryFn: () => fetchTimeSeries(days) });

export const useTopProducts = () =>
  useQuery({ queryKey: ["top-products"], queryFn: fetchTopProducts });

export const useRecentOrders = () =>
  useQuery({ queryKey: ["recent-orders"], queryFn: fetchRecentOrders });
