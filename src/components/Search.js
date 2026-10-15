"use client";

import { useState } from "react";
import styles from "../../assets/styles/search.module.css";

const tags = [
  "Medicine Specialist",
  "Emergency",
  "Female Disease",
  "Child Disease",
  "COVID 19",
  "Orthopedic Surgery",
  "Heart Disease",
];

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    console.log("Searching for:", query, "near", location);
    // Later: send this to your API or redirect to a results page
  }

  return (
    <div className={styles.box}>
      <form className={styles.row} onSubmit={handleSearch}>

        {/* Search input */}
        <div className={styles.field}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by doctor, symptoms or department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Location input */}
        <div className={styles.field}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 21s7-7.5 7-12a7 7 0 10-14 0c0 4.5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <input
            type="text"
            placeholder="Set your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Search button */}
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>

      {/* Quick tags */}
      <div className={styles.tags}>
        <span className={styles.tagsLabel}>You may be looking for</span>
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <button key={tag} type="button" className={styles.tag}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}