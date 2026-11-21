
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import "./Shop.css";

import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Phones",
  "Laptops",
  "Monitors",
  "Keyboards",
  "CPUs",
  "Mice",
];

const PAGE_SIZE = 6;

export default function Shop() {
  const dispatch = useDispatch();

  const { items = [], loading, error } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...items];

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const value = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name = String(
          product.title || product.name || ""
        ).toLowerCase();

        return (
          name.includes(value) ||
          product.category?.toLowerCase().includes(value) ||
          product.brand?.toLowerCase().includes(value)
        );
      });
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.title || a.name || "").localeCompare(
          String(b.title || b.name || "")
        )
      );
    }

    return result;
  }, [items, category, search, sort]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, sort]);

  return (
    <main className="shop-page">
      <section className="shop-header">
        <div className="shop-header-content">
          <span className="shop-eyebrow">EXPLORE VENDRA</span>
          <h1>Find Your Next <span>Upgrade.</span></h1>
          <p>
            Discover quality tech products designed to make
            your everyday experience better.
          </p>
        </div>
      </section>

      <section className="shop-container">
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="shop-sort">
            <SlidersHorizontal size={18} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          <aside className="shop-sidebar">
            <h3>Categories</h3>

            {categories.map((item) => (
              <button
                key={item}
                className={`shop-category ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </aside>

          <div className="shop-products-section">
            <div className="shop-products-heading">
              <div>
                <h2>{category === "All" ? "All Products" : category}</h2>
                <p>{filteredProducts.length} products found</p>
              </div>
            </div>

            {loading && items.length === 0 ? (
              <div className="shop-message">Loading products...</div>
            ) : error ? (
              <div className="shop-message">{error}</div>
            ) : paginatedProducts.length === 0 ? (
              <div className="shop-empty">
                <Package size={42} />
                <h3>No products found</h3>
                <p>Try changing your search or category.</p>
              </div>
            ) : (
              <div className="shop-products-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="shop-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
