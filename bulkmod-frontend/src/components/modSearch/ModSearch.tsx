import React, { useState, useEffect } from "react";
import SearchHeader from "./SearchHeader";
import SearchResults from "./SearchResults";
import Footer from "../common/Footer";
import { ModrinthProject } from "../modLists/types";
import { Card, CardContent } from "../ui";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ModSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<ModrinthProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState(20);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);



  // Fetch mods from backend API
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }
    
    // Set loading state
    setLoading(true);
    setError(null);
    
    // Build query parameters
    const params = new URLSearchParams({
      q: debouncedQuery,
      limit: view.toString(),
      offset: '0',
      sort: sort
    });

    fetch(`${API_BASE}/search-mods?${params.toString()}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.hits)) {
          setResults(
            data.hits.map((mod: any) => ({
              id: mod.project_id || mod.id,
              slug: mod.slug,
              author: mod.author,
              title: mod.title,
              description: mod.description,
              downloads: mod.downloads,
              followers: mod.follows || mod.followers,
              client_side: mod.client_side,
              server_side: mod.server_side,
              categories: mod.categories,
              project_type: mod.project_type,
              gallery: mod.gallery || [],
              icon_url: mod.icon_url || null,
              updated: mod.date_modified || mod.updated,
              loaders:
                mod.loaders ||
                mod.categories?.filter((c: string) =>
                  ["fabric", "forge", "quilt", "neoforge"].includes(c.toLowerCase())
                ) ||
                [],
            }))
          );
        } else {
          setResults([]);
          setError("No mods found or unexpected response.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError("Failed to fetch mods.");
        setLoading(false);
      });
  }, [debouncedQuery, sort, view]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white overflow-x-hidden">
      <main className="flex-grow flex justify-center p-6 pt-20">
        <div className="max-w-5xl w-full">
          <Card>
            <CardContent className="p-6">
              <SearchHeader 
                query={query} 
                onQueryChange={setQuery}
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
              />
              <SearchResults 
                results={results} 
                loading={loading} 
                error={error} 
                hasQuery={!!debouncedQuery} 
              />

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
