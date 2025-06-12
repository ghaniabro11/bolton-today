"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Search = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const handleSearch = () => {
    window.location.href = `/?s=${searchQuery}`;
  };
  return (
    <div className="flex border border-black/20">
      <Input
        type="search"
        aria-label="search-news"
        className="outline-none border-none shadow-none focus-visible:ring-0 focus-visible:border-none"
        onChange={(e) => setSearchQuery(e.target.value)} // Add this line
      />
      <Button
        className="rounded-none cursor-pointer"
        variant={"default"}
        onClick={handleSearch} // Add this line
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
