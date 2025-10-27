import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic"; // ensure SSR on every request

export const metadata = {
  title: "Inventory Dashboard - Real-Time Stock Management",
  description:
    "Monitor your product inventory in real-time. Track low stock items and get instant inventory statistics.",
};

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export default async function Dashboard() {
  const allProducts = await readData();
  // Sort by lastUpdated date (newest first)
  const products = [...allProducts].sort(
    (a: any, b: any) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
  const total = products.length;
  const lowStock = products.filter((p: any) => p.inventory <= 5);
  const outOfStock = products.filter((p: any) => p.inventory === 0);
  const mediumStock = products.filter(
    (p: any) => p.inventory > 5 && p.inventory <= 20
  );
  const highStock = products.filter((p: any) => p.inventory > 20);

  const totalValue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.inventory,
    0
  );

  // Group by category
  const byCategory = products.reduce((acc: any, p: any) => {
    if (!acc[p.category]) {
      acc[p.category] = { count: 0, totalStock: 0, value: 0 };
    }
    acc[p.category].count += 1;
    acc[p.category].totalStock += p.inventory;
    acc[p.category].value += p.price * p.inventory;
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
      <p className="text-zinc-600 mt-2">
        Real-time inventory data (SSR) • Last updated:{" "}
        {new Date().toLocaleString()}
      </p>

      {/* Key Metrics */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>
        <div className="rounded-lg border bg-green-50 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-green-700">
            High Stock (&gt; 20)
          </h2>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {highStock.length}
          </p>
        </div>
        <div className="rounded-lg border bg-yellow-50 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-yellow-700">
            Medium Stock (6-20)
          </h2>
          <p className="text-3xl font-bold text-yellow-900 mt-2">
            {mediumStock.length}
          </p>
        </div>
        <div className="rounded-lg border bg-red-50 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-red-700">
            Low Stock (&le; 5)
          </h2>
          <p className="text-3xl font-bold text-red-900 mt-2">
            {lowStock.length}
          </p>
        </div>
      </section>

      {/* Inventory Value */}
      <section className="mt-6 rounded-lg border bg-blue-50 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-blue-700">
          Total Inventory Value
        </h2>
        <p className="text-3xl font-bold text-blue-900 mt-2">
          ${totalValue.toFixed(2)}
        </p>
      </section>

      {/* Low Stock Alert */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">🔔 Low Stock Alert</h2>
        {lowStock.length === 0 ? (
          <p className="text-zinc-600">All products have sufficient stock!</p>
        ) : (
          <div className="space-y-2">
            {lowStock.map((p: any) => (
              <div
                key={p.id}
                className="rounded-lg border p-4 bg-yellow-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{p.name}</div>
                    <div className="text-sm text-zinc-600 mt-1">
                      Category: <span className="capitalize">{p.category}</span>{" "}
                      • Price: ${p.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        p.inventory === 0
                          ? "text-red-600"
                          : p.inventory <= 3
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.inventory}
                    </div>
                    <div className="text-xs text-zinc-500">units left</div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      p.inventory === 0
                        ? "bg-red-600"
                        : p.inventory <= 3
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min((p.inventory / 20) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Out of Stock Alert */}
      {outOfStock.length > 0 && (
        <section className="mt-8">
          <div className="rounded-lg border-2 border-red-500 bg-red-50 p-5">
            <h2 className="text-lg font-semibold text-red-900">
              ⚠️ Out of Stock ({outOfStock.length})
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {outOfStock.map((p: any) => (
                <div
                  key={p.id}
                  className="rounded bg-white p-3 border border-red-200"
                >
                  <div className="font-medium text-red-900">{p.name}</div>
                  <div className="text-sm text-red-700">{p.category}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Breakdown */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCategory).map(([category, data]: [string, any]) => (
            <div
              key={category}
              className="rounded-lg border p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold capitalize text-lg">{category}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Products:</span>
                  <span className="font-medium">{data.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Total Stock:</span>
                  <span className="font-medium">{data.totalStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Category Value:</span>
                  <span className="font-medium">${data.value.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Products Table */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Products Inventory</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Value
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 capitalize text-sm text-zinc-600">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">${p.price}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {p.inventory}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    ${(p.price * p.inventory).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        p.inventory === 0
                          ? "bg-red-100 text-red-800"
                          : p.inventory <= 5
                          ? "bg-yellow-100 text-yellow-800"
                          : p.inventory <= 20
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {p.inventory === 0
                        ? "Out"
                        : p.inventory <= 5
                        ? "Low"
                        : p.inventory <= 20
                        ? "Med"
                        : "High"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
