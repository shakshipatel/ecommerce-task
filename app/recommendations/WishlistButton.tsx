"use client";
import React, { useEffect, useState } from "react";

export default function WishlistButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const store = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setSaved(store.includes(id));
    } catch (_) {}
  }, [id]);

  function toggle() {
    try {
      const store = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let next;
      if (store.includes(id)) {
        next = store.filter((s: string) => s !== id);
      } else {
        next = [...store, id];
      }
      localStorage.setItem("wishlist", JSON.stringify(next));
      setSaved(!saved);
    } catch (_) {}
  }

  return (
    <button
      onClick={toggle}
      className={`rounded px-3 py-1 border ${
        saved ? "bg-yellow-100" : "bg-white"
      }`}
    >
      {saved ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}
