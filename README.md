# Leegality Product Listing

A React e-commerce product listing app built with Vite, Redux Toolkit, and React Router. Products are fetched from the [DummyJSON](https://dummyjson.com) API.

## Features

- **Product listing** with search, category filtering, price range, and brand filters
- **Product detail page** with full product information
- **Shopping cart** with add/remove/quantity controls, persisted to `localStorage`
- **Checkout page**
- **User profile page**
- Responsive layout with mobile bottom navigation and a slide-in cart drawer

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19, Lucide React |
| State | Redux Toolkit |
| Routing | React Router DOM v7 |
| Build | Vite 6 |
| Data | DummyJSON REST API |

## Project Structure

```
src/
  api/           # DummyJSON fetch helpers
  components/    # Shared UI components (Header, CartDrawer, ProductCard, …)
  context/       # CartContext, ProfileContext
  pages/         # Route-level pages (ProductListingPage, ProductDetailPage, …)
  store/         # Redux store + slices (products, productDetail)
  utils/         # Filter / pagination helpers
  styles.css
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Other scripts

| Script | Description |
|---|---|
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
