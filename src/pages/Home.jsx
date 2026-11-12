
import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getProducts } from "../services/productService";

const PAGE_SIZE = 8;

const categories = [
  "All",
  "Phones",
  "Laptops",
  "Monitors",
  "Keyboards",
  "CPUs",
  "Mice",
];

export default function Home() {
  // Fetch products using TanStack Query
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = items.filter((product) => {
      const matchesSearch = `${product.name} ${product.brand} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        matchesSearch &&
        (category === "All" || product.category === category)
      );
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "featured") {
      result = [...result].sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [items, search, category, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const visible = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const changeCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">THE NEXT-GEN TECH STORE</span>

          <h1>
            Upgrade your
            <br />
            <em>everyday.</em>
          </h1>

          <p>
            Discover phones, laptops and essential tech built to keep you one
            step ahead.
          </p>

          <a href="#shop" className="button hero-button">
            Explore collection <span>↗</span>
          </a>
        </div>

        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-device">
            <div className="device-screen">
              <span>V.</span>
              <small>TECH / 2026</small>
            </div>
          </div>

          <div className="hero-chip chip-one">PERFORMANCE</div>
          <div className="hero-chip chip-two">DESIGNED TO MOVE</div>
        </div>

        <div className="hero-bottom">
          <span>01 / CURATED TECH</span>
          <span>QUALITY · VALUE · PERFORMANCE</span>
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR NEXT FAVOURITE</span>

            <h2>
              Shop the collection<span className="brand-dot">.</span>
            </h2>
          </div>

          <p>Technology that works as hard as you do.</p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Search products, brands..."
            />
          </div>

          <div className="filter-control">
            <SlidersHorizontal size={16} />

            <select
              value={category}
              onChange={(e) => changeCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="filter-control">
            <ArrowUpDown size={16} />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="category-pills">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category-pill active"
                  : "category-pill"
              }
              onClick={() => changeCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {isLoading && <Loader text="Loading products..." />}

        {isError && (
          <div className="error-box">
            Could not load products: {error.message}. Check that JSON Server
            is running on port 3001.
          </div>
        )}

        {!isLoading && !isError && visible.length === 0 && (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try another search or category.</p>

            <button
              className="button"
              onClick={() => {
                changeSearch("");
                changeCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {!isLoading && !isError && visible.length > 0 && (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !isError && pageCount > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {pageCount}
            </span>

            <button
              disabled={page === pageCount}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
