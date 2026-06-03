export const PAGE_SIZE = 12;

export const CATEGORY_GROUPS = [
  {
    id: "mobiles",
    name: "Mobiles",
    slugs: ["smartphones", "mobile-accessories", "tablets"],
  },
  {
    id: "electronics",
    name: "Electronics",
    slugs: ["laptops", "tablets", "mobile-accessories"],
  },
  {
    id: "fashion",
    name: "Fashion",
    slugs: [
      "mens-shirts",
      "mens-shoes",
      "mens-watches",
      "sunglasses",
      "tops",
      "womens-bags",
      "womens-dresses",
      "womens-jewellery",
      "womens-shoes",
      "womens-watches",
    ],
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    slugs: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  {
    id: "computers",
    name: "Computers",
    slugs: ["laptops", "tablets"],
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    slugs: ["sports-accessories"],
  },
];

export function getCategoryGroup(categoryId) {
  return CATEGORY_GROUPS.find((category) => category.id === categoryId);
}

export function filterProducts(products, filters) {
  const minPrice = Number(filters.minPrice);
  const maxPrice = Number(filters.maxPrice);
  const categoryGroup = getCategoryGroup(filters.category);

  return products.filter((product) => {
    const categoryMatches =
      !categoryGroup || categoryGroup.slugs.includes(product.category);
    const brandMatches =
      filters.brands.length === 0 || filters.brands.includes(product.brand);
    const minMatches = !filters.minPrice || product.price >= minPrice;
    const maxMatches = !filters.maxPrice || product.price <= maxPrice;

    return categoryMatches && brandMatches && minMatches && maxMatches;
  });
}

export function paginate(items, page) {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    currentPage,
    pageCount,
    items: items.slice(start, start + PAGE_SIZE),
  };
}

export function uniqueBrands(products) {
  return [...new Set(products.map((product) => product.brand).filter(Boolean))].sort();
}

export function getFiltersFromSearch(searchParams) {
  return {
    category: searchParams.get("category") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    brands: searchParams.getAll("brand"),
    query: searchParams.get("q") ?? "",
    page: Number(searchParams.get("page") ?? "1"),
  };
}

export function setSearchValue(searchParams, key, value) {
  const next = new URLSearchParams(searchParams);

  if (value) {
    next.set(key, value);
  } else {
    next.delete(key);
  }

  next.set("page", "1");
  return next;
}
