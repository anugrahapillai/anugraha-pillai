"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ArticleCard from "@/components/public/ArticleCard";
import PosterCard from "@/components/public/PosterCard";
import ResearchRow from "@/components/public/ResearchRow";
import { mockContent } from "@/lib/repositories/mock-admin";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockContent.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="page-container">
      <header className="page-header">
        <p className="eyebrow">Search</p>
        <h1>Search Library</h1>
        <p>Find dispatches, poster designs, and research reports by title or topic.</p>
      </header>

      <div className="search-box">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search (e.g. communication, urban, policy)…"
          autoFocus
        />
      </div>

      {query && (
        <section className="search-results">
          <p className="search-summary">
            Found {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
          </p>

          {results.length > 0 ? (
            <div className="grid-articles">
              {results.map((item) => {
                if (item.type === "Blog") return <ArticleCard key={item.id} {...item} />;
                if (item.type === "Poster") return <PosterCard key={item.id} {...item} />;
                if (item.type === "Research") return <ResearchRow key={item.id} {...item} />;
                return (
                  <div key={item.id} className="article-card">
                    <span className="article-card__category">{item.type}</span>
                    <h3><Link href="/">{item.title}</Link></h3>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No dispatches or research matching &quot;{query}&quot;. Try another search term.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
