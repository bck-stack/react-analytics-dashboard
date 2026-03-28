import clsx from "clsx";
import type { KpiCard } from "../api/metrics";

interface Props {
  card: KpiCard;
  loading?: boolean;
}

export default function KpiCard({ card, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-gray-800 p-5 animate-pulse h-28" />
    );
  }

  const isPositive = card.change >= 0;

  return (
    <div className="rounded-2xl bg-gray-800 p-5 flex flex-col gap-2 hover:ring-1 hover:ring-brand-500 transition">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {card.label}
      </span>
      <span className="text-3xl font-bold text-white">{card.value}</span>
      <span
        className={clsx(
          "text-sm font-medium",
          isPositive ? "text-emerald-400" : "text-red-400"
        )}
      >
        {isPositive ? "▲" : "▼"} {Math.abs(card.change)}% vs last period
      </span>
    </div>
  );
}
