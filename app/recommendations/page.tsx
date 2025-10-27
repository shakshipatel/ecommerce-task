import products from "../../data/products.json";
import WishlistButton from "./WishlistButton";

export const metadata = {
  title: "Recommended Products - Personalized Picks",
  description:
    "Check out our top recommended products based on popularity and availability. Add items to your wishlist!",
};

export default function Recommendations() {
  // Group products by category
  const categories = products.reduce((acc: any, p: any) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Get top 2 products from each category by inventory
  const recommendations: any = {};
  Object.keys(categories).forEach((cat) => {
    recommendations[cat] = categories[cat]
      .sort((a: any, b: any) => b.inventory - a.inventory)
      .slice(0, 2);
  });

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Recommended for you</h1>
      <p className="text-zinc-600 mt-2">
        Server-rendered recommendations grouped by category. Add items to your
        wishlist!
      </p>

      {Object.keys(recommendations).map((category) => (
        <section key={category} className="mt-8">
          <h2 className="text-xl font-semibold capitalize mb-4">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendations[category].map((p: any) => (
              <div
                key={p.id}
                className="rounded border p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-zinc-600 mt-1">${p.price}</p>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Stock: {p.inventory}
                </p>
                <div className="mt-3">
                  <WishlistButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
