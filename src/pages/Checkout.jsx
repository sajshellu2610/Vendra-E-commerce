
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearCartAsync } from "../redux/slices/cartSlice";
import { placeOrder } from "../redux/slices/orderSlice";

export default function Checkout() {
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.items);
  const { loading, error } = useSelector((state) => state.orders);
  const cartError = useSelector((state) => state.cart.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line: "",
    city: "",
    pincode: "",
  });

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (!items.length) return;

    setSubmitting(true);

    try {
      const order = {
        userId: String(user.id),
        customerName: address.fullName,
        address: { ...address },
        items: items.map(
          ({ id, name, price, quantity, image }) => ({
            id,
            name,
            price,
            quantity,
            image,
          })
        ),
        total,
        status: "Placed",
        createdAt: new Date().toISOString(),
      };

      // Save order 
      const result = await dispatch(placeOrder(order));

      if (!placeOrder.fulfilled.match(result)) {
        return;
      }

      // Clear cart 
      const clearResult = await dispatch(clearCartAsync(user.id));

      if (!clearCartAsync.fulfilled.match(clearResult)) {
        return;
      }

      navigate("/orders");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <section className="empty-state">
        <h2>Nothing to checkout</h2>
        <p>Add products to your cart first.</p>
        <Link to="/" className="button">
          Go shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="content-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ALMOST THERE</span>
          <h1>
            Checkout<span className="brand-dot">.</span>
          </h1>
        </div>
      </div>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Delivery details</h2>

          <label>
            Full name
            <input
              name="fullName"
              required
              value={address.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              required
              pattern="[0-9]{10}"
              title="Enter a 10-digit phone number"
              value={address.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />
          </label>

          <label>
            Address
            <input
              name="line"
              required
              value={address.line}
              onChange={handleChange}
              placeholder="House name, street, area"
            />
          </label>

          <div className="form-two">
            <label>
              City
              <input
                name="city"
                required
                value={address.city}
                onChange={handleChange}
              />
            </label>

            <label>
              PIN code
              <input
                name="pincode"
                required
                pattern="[0-9]{6}"
                title="Enter a 6-digit PIN code"
                value={address.pincode}
                onChange={handleChange}
              />
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          {cartError && (
            <div className="form-error">
              Cart could not be cleared: {cartError}
            </div>
          )}

          <button
            type="submit"
            className="button auth-submit"
            disabled={submitting || loading}
          >
            {submitting || loading
              ? "Processing order..."
              : "Place order"}
          </button>
        </form>

        <aside className="summary-card">
          <h2>Order summary</h2>

          {items.map((item) => (
            <div key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹
                {(Number(item.price) * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <p className="muted-note">
            Demo checkout — no real payment is collected.
          </p>
        </aside>
      </div>
    </section>
  );
}
