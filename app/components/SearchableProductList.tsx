"use client";
import React, { useMemo, useState } from "react";

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

const ITEMS_PER_PAGE = 8;

export default function SearchableProductList({
  initial,
}: {
  initial: Product[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(initial.map((p) => p.category));
    return ["all", ...Array.from(cats).sort()];
  }, [initial]);

  // Filter products
  const filtered = useMemo(() => {
    let results = initial;

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return results;
  }, [query, selectedCategory, initial]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory]);

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <input
          aria-label="Search products"
          className="w-full rounded border px-3 py-2"
          placeholder="Search by name, category or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-sm text-zinc-600">
          Showing {paginatedProducts.length} of {filtered.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((p) => (
          <a
            key={p.id}
            href={`/products/${p.slug}`}
            className="block rounded border p-4 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-zinc-600 mt-1">
              {p.category} — ${p.price}
            </p>
            <p className="mt-2 text-sm text-zinc-700 line-clamp-2">
              {p.description}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Inventory: {p.inventory}
            </p>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
