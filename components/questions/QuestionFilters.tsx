"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "food_science", label: "Food Science" },
  { value: "engineering",  label: "Engineering" },
  { value: "career",       label: "Career" },
];

export default function QuestionFilters() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ]    = useState(searchParams.get("q") ?? "");

  function applyFilter(category: string) {
    const params = new URLSearchParams();
    if (category)  params.set("category", category);
    if (q.trim())  params.set("q", q.trim());
    router.push(`/dashboard/questions?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const category = searchParams.get("category") ?? "";
    const params   = new URLSearchParams();
    if (category)  params.set("category", category);
    if (q.trim())  params.set("q", q.trim());
    router.push(`/dashboard/questions?${params.toString()}`);
  }

  const currentCat = searchParams.get("category") ?? "";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => applyFilter(c.value)}
            className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              currentCat === c.value
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-surface-600 border-surface-200 hover:border-brand-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 flex-1">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search questions…"
          className="input text-sm flex-1"
        />
        <button type="submit" className="btn-secondary text-sm px-3">
          Search
        </button>
      </form>
    </div>
  );
}
