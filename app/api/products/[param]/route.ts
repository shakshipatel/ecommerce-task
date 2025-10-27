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

export async function GET(req: any, { params }: any) {
  const { param } = await params;
  const products = await readData();

  // try by slug first
  let product = products.find((p: any) => p.slug === param);
  if (product) return NextResponse.json(product);

  // fallback: try by id
  product = products.find((p: any) => p.id === param);
  if (product) return NextResponse.json(product);

  return new NextResponse(JSON.stringify({ error: "Not found" }), {
    status: 404,
  });
}

export async function PUT(req: any, { params }: any) {
  const adminKey = req.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { param } = await params; // treat param as id for update
    const body = await req.json();
    const products = await readData();
    const idx = products.findIndex(
      (p: any) => p.id === param || p.slug === param
    );
    if (idx === -1)
      return new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });

    const updated = {
      ...products[idx],
      ...body,
      lastUpdated: new Date().toISOString(),
    };
    products[idx] = updated;
    await writeData(products);

    return NextResponse.json(updated);
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
