import React from "react";
import { ChevronRight, UserCircle, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORY_GROUPS } from "../utils/filters.js";

const trendingItems = ["Bestsellers", "New Releases"];

export default function CategoryDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function selectCategory(categoryId) {
    const next = new URLSearchParams(searchParams);
    next.set("category", categoryId);
    next.set("page", "1");
    next.delete("brand");
    navigate(`/?${next.toString()}`);
    onClose();
  }

  function showAll() {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    next.set("page", "1");
    navigate(`/?${next.toString()}`);
    onClose();
  }

  return (
    <>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`category-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-user">
          <UserCircle size={27} />
          <span>Hello, sign in</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-scroll">
          <section className="drawer-section">
            <button className="drawer-link drawer-home-link" onClick={showAll}>
              <span>Home</span>
            </button>
          </section>

          <section className="drawer-section">
            <h2>Trending</h2>
            {trendingItems.map((item) => (
              <button className="drawer-link" key={item} onClick={showAll}>
                <span>{item}</span>
              </button>
            ))}
          </section>

          <section className="drawer-section">
            <h2>Shop by Category</h2>
            {CATEGORY_GROUPS.map((category) => (
              <button
                className="drawer-link"
                key={category.id}
                onClick={() => selectCategory(category.id)}
              >
                <span>{category.name}</span>
                <ChevronRight size={19} />
              </button>
            ))}
            <button className="drawer-link drawer-see-all" onClick={showAll}>
              <span>See all</span>
            </button>
          </section>

          <section className="drawer-section">
            <h2>Programs & Features</h2>
            <button className="drawer-link" onClick={showAll}>
              <span>Gift Cards & Mobile Recharges</span>
              <ChevronRight size={19} />
            </button>
            <button className="drawer-link" onClick={showAll}>
              <span>Amazon Launchpad</span>
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}
