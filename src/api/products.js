const API_BASE = "https://dummyjson.com";

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchCategories() {
  const data = await getJson("/products/categories");

  return data.map((category) => {
    if (typeof category === "string") {
      return { slug: category, name: titleCase(category) };
    }

    return {
      slug: category.slug ?? category.name,
      name: category.name ?? titleCase(category.slug),
    };
  });
}

export async function fetchProductsByCategory(category) {
  const encoded = encodeURIComponent(category);
  const firstPage = await getJson(`/products/category/${encoded}?limit=1`);
  const total = firstPage.total ?? firstPage.products?.length ?? 0;

  if (total <= 1) {
    return firstPage.products ?? [];
  }

  const fullPage = await getJson(`/products/category/${encoded}?limit=${total}`);
  return fullPage.products ?? [];
}

export async function fetchAllProducts() {
  const firstPage = await getJson("/products?limit=1");
  const total = firstPage.total ?? 0;
  const fullPage = await getJson(`/products?limit=${total}`);

  return fullPage.products ?? [];
}

export async function fetchProductById(id) {
  return getJson(`/products/${id}`);
}

function titleCase(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
