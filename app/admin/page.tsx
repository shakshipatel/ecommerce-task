"use client";
import React, { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
};

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin Panel - Product Management | E-Commerce Store";
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [adminKey, setAdminKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    inventory: "",
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        inventory: Number(form.inventory),
        category: form.category,
        description: form.description,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || res.statusText));
        return;
      }

      const created = await res.json();
      setProducts((s) => [created, ...s]);
      setForm({
        name: "",
        price: "",
        inventory: "",
        category: "",
        description: "",
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    const newPrice = prompt("New price:");
    if (!newPrice) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ price: Number(newPrice) }),
    });
    if (!res.ok) {
      alert("Update failed");
      return;
    }
    const updated = await res.json();
    setProducts((s) => s.map((p) => (p.id === id ? updated : p)));
  }

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort();

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-600 mt-2">
            Manage your product inventory and pricing
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!adminKey}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          + Add New Product
        </button>
      </div>

      <section className="mb-6">
        <label className="block mb-2 font-medium">Admin Key *</label>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="max-w-md rounded border px-3 py-2"
          placeholder="shakshipatel"
        />
        {!adminKey && (
          <p className="text-sm text-amber-600 mt-1">
            ⚠️ Admin key required to create or edit products (use: shakshipatel)
          </p>
        )}
      </section>

      <section className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or description..."
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(searchQuery || categoryFilter) && (
          <p className="text-sm text-zinc-600 mt-2">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Products ({filteredProducts.length})
        </h2>
        <div className="grid gap-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-sm text-zinc-600 mt-1">
                  <span className="capitalize">{p.category}</span> • ${p.price}{" "}
                  • {p.inventory} in stock
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(p.id)}
                  disabled={!adminKey}
                  className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Edit Price
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Wireless Headphones"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price ($) *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="99.99"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Inventory *
                </label>
                <input
                  required
                  type="number"
                  value={form.inventory}
                  onChange={(e) =>
                    setForm({ ...form, inventory: e.target.value })
                  }
                  placeholder="50"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g., electronics, fitness, home"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product description..."
                  rows={3}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
