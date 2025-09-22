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
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-green-400/60">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">Search for some mods</p>
          <p className="text-slate-500 text-sm mt-2">Enter a search term above to find mods</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-slate-400/60">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">No mods found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-slate-800 hover:scrollbar-thumb-green-500 transition-colors duration-200">
      <div className="space-y-4 pr-2">
        {results.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  );
} 