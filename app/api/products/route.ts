import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const products = await readData();
  return NextResponse.json(products);
}

export async function POST(req: any) {
  const adminKey = req.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const products = await readData();
    const id = (
      Math.max(0, ...products.map((p: any) => Number(p.id))) + 1
    ).toString();
    const now = new Date().toISOString();
    const newProduct = {
      id,
      name: body.name || "",
      slug: body.slug || (body.name || "").toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      price: Number(body.price) || 0,
      category: body.category || "uncategorized",
      inventory: Number(body.inventory) || 0,
      lastUpdated: now,
    };

    products.push(newProduct);
    await writeData(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
