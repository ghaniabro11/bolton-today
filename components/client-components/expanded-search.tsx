"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function ExpandableSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };
  const handleSearch = () => {
    window.location.href = `/?s=${searchQuery}`;
  };
  return (
    <div
      className="relative flex items-center"
      tabIndex={0}
      onBlur={handleBlur}
    >
      <div
        className={`flex items-center border border-gray-300 rounded bg-white shadow-md transition-all duration-300 ${
          isOpen ? "px-1 py-1 w-64" : "p-1 w-10 justify-center text-center"
        }`}
      >
        <Search
          className=" text-gray-600 ml-1.5 cursor-pointer"
          onClick={isOpen ? handleSearch : () => setIsOpen(true)}
        />
        {/* onClick={handleSearch} // Add this line */}

        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)} // Add this line
          // onClick={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className={`bg-transparent outline-none text-sm text-gray-700 ml-2 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 w-full px-1"
              : "opacity-0 w-0 px-0 pointer-events-none"
          }`}
        />
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            suppressHydrationWarning={true}
            className="ml-2 text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
