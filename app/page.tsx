import products from "../data/products.json";
import SearchableProductList from "./components/SearchableProductList";

export const metadata = {
  title: "Home - E-Commerce Product Catalog",
  description:
    "Browse our complete product catalog with instant search and filtering. Shop the best deals on electronics, footwear, and wearables.",
};

export default function Home() {
  // importing the JSON file at build time ensures the page is statically generated (SSG)
  return (
    <main className="min-h-screen w-full max-w-5xl mx-auto p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <p className="text-zinc-600 mt-2">
          Statically generated at build time. Use the search to filter
          client-side.
        </p>
      </header>

      <SearchableProductList initial={products} />
    </main>
  );
}
