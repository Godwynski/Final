"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query")?.toString() || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync with URL when query changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [query]); // Only depend on query

  // Memoized search handler
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("query", debouncedSearchTerm);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  // Trigger search when debounced value changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by case #, title, location, or party..."
        value={searchTerm}
        onChange={onInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
    </div>
  );
}
