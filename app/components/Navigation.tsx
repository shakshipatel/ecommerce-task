"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 border-b border-gray-200 mb-8">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg text-gray-900 hover:text-blue-600"
          >
            E-Commerce
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`${
                pathname === "/dashboard"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className={`${
                pathname === "/admin"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/recommendations"
              className={`${
                pathname === "/recommendations"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Recommendations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
