import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input, Dropdown } from "../ui";


const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Downloads", value: "downloads" },
  { label: "Followers", value: "follows" },
  { label: "Date published", value: "created" },
  { label: "Date updated", value: "updated" },
];

const VIEW_OPTIONS = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  view: number;
  onViewChange: (view: number) => void;
}

export default function SearchHeader({ 
  query, 
  onQueryChange, 
  sort, 
  onSortChange, 
  view, 
  onViewChange 
}: SearchHeaderProps) {

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Input
            leftIcon={<FiSearch className="text-lg" />}
            type="text"
            placeholder="Search mods..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="py-3 text-base"
          />
        </div>
        
        {/* Sort dropdown */}
        <Dropdown
          options={SORT_OPTIONS}
          value={sort}
          onValueChange={onSortChange}
          placeholder="Sort by"
          className="w-44"
        />
        
        {/* View dropdown */}
        <Dropdown
          options={VIEW_OPTIONS}
          value={view}
          onValueChange={onViewChange}
          placeholder="View"
          className="w-18"
        />
      </div>
    </div>
  );
} 