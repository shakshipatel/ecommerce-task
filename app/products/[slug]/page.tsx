import products from "../../../data/products.json";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p: any) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - $${product.price} | E-Commerce`,
    description: `${product.description} Available in ${product.category}. Only ${product.inventory} left in stock!`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p: any) => p.slug === slug);
  if (!product) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-zinc-600 mt-2">
        {product.category} — ${product.price}
      </p>
      <p className="mt-4">{product.description}</p>
      <p className="mt-3 text-sm text-zinc-500">
        Inventory: {product.inventory}
      </p>
      <p className="mt-2 text-xs text-zinc-400">
        Last updated: {new Date(product.lastUpdated).toLocaleString()}
      </p>
    </main>
  );
}
