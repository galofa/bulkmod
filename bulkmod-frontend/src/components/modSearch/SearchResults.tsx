import React from "react";
import ModCard from "../modLists/ModCard";
import { ModrinthProject } from "../modLists/types";

interface SearchResultsProps {
  results: ModrinthProject[];
  loading: boolean;
  error: string | null;
  hasQuery: boolean;
}

export default function SearchResults({ results, loading, error, hasQuery }: SearchResultsProps) {
  if (loading) {
    return <div className="text-green-400 mb-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 mb-4">{error}</div>;
  }

  if (!hasQuery) {
    return null;
  }

  if (results.length === 0) {
    return <div className="text-slate-400 text-center">No mods found.</div>;
  }

  return (
    <div className="max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-slate-800 hover:scrollbar-thumb-green-500 transition-colors duration-200">
      <div className="space-y-4 pr-2">
        {results.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  );
} 