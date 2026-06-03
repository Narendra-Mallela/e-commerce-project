import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import FiltersSidebar from "../components/FiltersSidebar.jsx";
import HomePage from "../components/HomePage.jsx";
import Pagination from "../components/Pagination.jsx";
import ProductCard from "../components/ProductCard.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { loadProducts } from "../store/productsSlice.js";
import {
  CATEGORY_GROUPS,
  filterProducts,
  getCategoryGroup,
  getFiltersFromSearch,
  paginate,
  uniqueBrands,
} from "../utils/filters.js";

export default function ProductListingPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFiltersFromSearch(searchParams);

  const { items: products, loading, error } = useSelector((state) => state.products);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(loadProducts());
    }
  }, [dispatch]);

  const categoryProducts = useMemo(() => {
    const selectedGroup = getCategoryGroup(filters.category);

    if (!selectedGroup) {
      return products;
    }

    return products.filter((product) => selectedGroup.slugs.includes(product.category));
  }, [products, filters.category]);

  const filteredProducts = useMemo(() => {
    const bySearch = filters.query.trim().toLowerCase();
    const searched = bySearch
      ? categoryProducts.filter((product) =>
          [product.title, product.description, product.brand, product.category]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(bySearch),
        )
      : categoryProducts;

    return filterProducts(searched, { ...filters, category: "" });
  }, [categoryProducts, filters.query, filters.minPrice, filters.maxPrice, filters.brands]);

  const brands = useMemo(() => uniqueBrands(categoryProducts), [categoryProducts]);
  const pagination = paginate(filteredProducts, filters.page);
  const selectedCategory = getCategoryGroup(filters.category);
  const isHomePage =
    !filters.category &&
    !filters.query &&
    !filters.minPrice &&
    !filters.maxPrice &&
    filters.brands.length === 0 &&
    filters.page === 1;

  function handlePageChange(page) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  }

  if (loading) {
    return <StatusMessage title="Loading products" message="Fetching products from DummyJSON." />;
  }

  if (error) {
    return <StatusMessage title="Unable to load products" message={error} />;
  }

  if (isHomePage) {
    return <HomePage products={products} />;
  }

  return (
    <div className={`listing-layout${filtersOpen ? " filters-open" : ""}`}>
      {filtersOpen && (
        <div className="mobile-filter-backdrop" onClick={() => setFiltersOpen(false)} />
      )}
      <FiltersSidebar
        brands={brands}
        categories={CATEGORY_GROUPS}
        filters={filters}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onClose={() => setFiltersOpen(false)}
        mobileOpen={filtersOpen}
      />

      <section className="products-area">
        <div className="listing-title">
          <h1>{selectedCategory?.name ?? "Products"}</h1>
          <div className="listing-title-right">
            <p>{filteredProducts.length} items found</p>
            <button
              className="mobile-filter-toggle"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        {pagination.items.length === 0 && (
          <StatusMessage title="No products found" message="Try changing the selected filters." />
        )}
        {pagination.items.length > 0 && (
          <>
            <div className="product-grid">
              {pagination.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              pageCount={pagination.pageCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
}
