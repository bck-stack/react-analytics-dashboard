import type { TopProduct } from "../api/metrics";

interface Props {
  data: TopProduct[];
  loading?: boolean;
}

export default function TopProductsTable({ data, loading }: Props) {
  if (loading) {
    return <div className="rounded-2xl bg-gray-800 h-64 animate-pulse" />;
  }

  const maxSales = Math.max(...data.map((p) => p.sales));

  return (
    <div className="rounded-2xl bg-gray-800 p-5">
      <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
        Top Products
      </h2>
      <div className="space-y-3">
        {data.map((product) => (
          <div key={product.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-200 truncate max-w-[60%]">{product.name}</span>
              <span className="text-gray-400">
                {product.sales.toLocaleString()} sales ·{" "}
                <span className="text-emerald-400">${product.revenue.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(product.sales / maxSales) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
