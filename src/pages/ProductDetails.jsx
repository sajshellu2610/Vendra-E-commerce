
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../services/productService";

import { addToCartAsync } from "../redux/slices/cartSlice";
import { toggleWishlistAsync } from "../redux/slices/wishlistSlice";

import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  // Fetch individual product using TanStack Query
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const saved = useSelector((state) =>
    state.wishlist.items.some(
      (item) => String(item.id) === String(id)
    )
  );

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <Loader text="Loading product details..." />;
  }

  if (isError) {
    return (
      <div className="empty-state">
        <h2>Could not load product</h2>
        <p>{error.message}</p>
        <Link to="/" className="button">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state">
        <h2>Product not found</h2>
        <Link to="/" className="button">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCartAsync({
        userId: user.id,
        product: {
          ...product,
          quantity,
        },
      })
    );
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      toggleWishlistAsync({
        userId: user.id,
        product,
      })
    );
  };

  return (
    <section className="details-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="details-grid">
        <div className="details-image">
          <img
            src={product.image || "/images/product-placeholder.svg"}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/images/product-placeholder.svg";
            }}
          />
        </div>

        <div className="details-content">
          <span className="eyebrow">
            {product.category} / {product.brand}
          </span>

          <h1>{product.name}</h1>

          <div className="details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}

            {product.oldPrice > product.price && (
              <del>
                ₹{Number(product.oldPrice).toLocaleString("en-IN")}
              </del>
            )}
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div
            className={
              product.stock > 0
                ? "stock-status in-stock"
                : "stock-status out-stock"
            }
          >
            {product.stock > 0
              ? `${product.stock} units available`
              : "Currently out of stock"}
          </div>

          <h3>Specifications</h3>

          <ul className="spec-list">
            {(product.specifications || []).map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>

          {product.stock > 0 && (
            <div className="purchase-row">
              <div className="quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  +
                </button>
              </div>

              <button
                className="button"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={17} /> Add to cart
              </button>
            </div>
          )}

          <button
            className="wishlist-detail"
            onClick={handleWishlist}
          >
            <Heart
              size={17}
              fill={saved ? "currentColor" : "none"}
            />
            {saved ? "Remove from wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
    </section>
  );
}