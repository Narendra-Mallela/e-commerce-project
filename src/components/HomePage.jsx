import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORY_GROUPS } from "../utils/filters.js";

const homeCardTitles = {
  mobiles: "Mobiles and accessories",
  electronics: "Electronics deals",
  fashion: "Revamp your style",
  "home-kitchen": "Home and kitchen picks",
  computers: "Computers and tablets",
  "toys-games": "Toys and games",
};

export default function HomePage({ products }) {
  const navigate = useNavigate();
  const heroProducts = products.slice(0, 3);

  function openCategory(categoryId) {
    navigate(`/?category=${categoryId}&page=1`);
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <button className="hero-arrow" aria-label="Previous hero">
          <ChevronLeft size={34} />
        </button>
        <div className="hero-copy">
          <p>Today&apos;s featured products</p>
          <h1>Shop fresh deals from every category</h1>
          <span>Real DummyJSON products | Fast browsing | Easy cart</span>
        </div>
        <div className="hero-products">
          {heroProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
            </Link>
          ))}
        </div>
        <button className="hero-arrow" aria-label="Next hero">
          <ChevronRight size={34} />
        </button>
      </section>

      <section className="home-deal-grid" aria-label="Home page deals">
        {CATEGORY_GROUPS.map((category) => {
          const items = products
            .filter((product) => category.slugs.includes(product.category))
            .slice(0, 4);

          return (
            <article className="home-deal-card" key={category.id}>
              <div className="home-card-heading">
                <span>{category.name}</span>
                <h2>{homeCardTitles[category.id]}</h2>
              </div>
              <div className="home-card-products">
                {items.map((product, index) => (
                  <Link
                    className={`home-card-product ${index === 0 ? "featured" : ""}`}
                    to={`/product/${product.id}`}
                    key={product.id}
                  >
                    <img src={product.thumbnail} alt={product.title} />
                    <span>{product.title}</span>
                    {index === 0 && <strong>${product.price}</strong>}
                  </Link>
                ))}
              </div>
              <button className="home-card-link" onClick={() => openCategory(category.id)}>
                Explore all
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
