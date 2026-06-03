import React from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { setSearchValue } from "../utils/filters.js";

export default function FiltersSidebar({
  brands,
  categories,
  filters,
  searchParams,
  setSearchParams,
  onClose,
  mobileOpen,
}) {
  function updateSingle(key, value) {
    const next = setSearchValue(searchParams, key, value);

    if (key === "category") {
      next.delete("brand");
    }

    setSearchParams(next);
  }

  function updateBrand(brand, checked) {
    const next = new URLSearchParams(searchParams);
    next.delete("brand");

    const selectedBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((item) => item !== brand);

    selectedBrands.forEach((item) => next.append("brand", item));
    next.set("page", "1");
    setSearchParams(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    const query = searchParams.get("q");

    if (query) {
      next.set("q", query);
    }

    setSearchParams(next);
  }

  return (
    <aside className={`filters-panel${mobileOpen ? " mobile-open" : ""}`} aria-label="Product filters">
      <div className="filters-heading">
        <span>
          <Filter size={18} />
          Filters
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="small-icon-button" onClick={clearFilters} aria-label="Clear filters" title="Clear filters">
            <X size={15} />
          </button>
          {onClose && (
            <button className="small-icon-button filters-close-mobile" onClick={onClose} aria-label="Close filters">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <label className="side-search">
        <Search size={15} />
        <input
          value={filters.query}
          onChange={(event) => updateSingle("q", event.target.value)}
          placeholder="Search..."
          type="search"
        />
      </label>

      <section className="filter-section">
        <h2>Categories</h2>
        <label className="check-row">
          <input
            type="radio"
            name="category"
            checked={!filters.category}
            onChange={() => updateSingle("category", "")}
          />
          All products
        </label>
        {categories.map((category) => (
          <label className="check-row" key={category.id}>
            <input
              type="radio"
              name="category"
              checked={filters.category === category.id}
              onChange={() => updateSingle("category", category.id)}
            />
            {category.name}
          </label>
        ))}
      </section>

      <section className="filter-section">
        <h2>Price Range</h2>
        <div className="price-grid">
          <input
            value={filters.minPrice}
            min="0"
            inputMode="numeric"
            onChange={(event) => updateSingle("minPrice", event.target.value)}
            placeholder="Min"
            type="number"
          />
          <input
            value={filters.maxPrice}
            min="0"
            inputMode="numeric"
            onChange={(event) => updateSingle("maxPrice", event.target.value)}
            placeholder="Max"
            type="number"
          />
        </div>
      </section>

      <section className="filter-section">
        <h2>
          <SlidersHorizontal size={15} />
          Brands
        </h2>
        {brands.length === 0 ? (
          <p className="muted-text">No brands available</p>
        ) : (
          <div className="brand-options">
            {brands.map((brand) => (
              <label className="check-row" key={brand}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(event) => updateBrand(brand, event.target.checked)}
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
