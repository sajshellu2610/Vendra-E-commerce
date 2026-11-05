
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCartAsync,
  updateCartQuantityAsync,
} from "../redux/slices/cartSlice";
import EmptyState from "../components/EmptyState";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleQuantityChange = (item, quantity) => {
    if (!user?.id) return;

    if (quantity < 1 || quantity > Number(item.stock)) return;

    dispatch(
      updateCartQuantityAsync({
        userId: user.id,
        id: item.id,
        quantity,
      })
    );
  };

  const handleRemove = (item) => {
    if (!user?.id) return;

    dispatch(
      removeFromCartAsync({
        userId: user.id,
        id: item.id,
      })
    );
  };

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Looks like you haven't added anything yet."
        action={
          <Link to="/" className="button">
            Explore products
          </Link>
        }
      />
    );
  }

  return (
    <section className="content-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR SELECTION</span>
          <h1>
            Shopping cart<span className="brand-dot">.</span>
          </h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img
                src={item.image || "/images/product-placeholder.svg"}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src = "/images/product-placeholder.svg";
                }}
              />

              <div className="cart-item-main">
                <Link
                  to={`/products/${item.id}`}
                  className="product-name"
                >
                  {item.name}
                </Link>

                <span className="eyebrow">{item.category}</span>

                <strong>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="quantity-control">
                <button
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    handleQuantityChange(item, item.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  disabled={item.quantity >= Number(item.stock)}
                  onClick={() =>
                    handleQuantityChange(item, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove-button"
                onClick={() => handleRemove(item)}
                aria-label="Remove item"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Order summary</h2>

          <div>
            <span>Subtotal</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <div>
            <span>Shipping</span>
            <strong>FREE</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <Link to="/checkout" className="button checkout-button">
            Continue to checkout
          </Link>

          <Link to="/" className="continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
