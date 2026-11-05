import React from 'react';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Orders() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items, loading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    if (user?.id) dispatch(fetchOrders(user.id));
  }, [dispatch, user?.id]);

  if (loading) return <Loader text="Loading your orders..." />;
  if (error) return <div className="error-box">{error}</div>;
  if (!items.length)
    return (
      <EmptyState
        title="No orders yet"
        message="Your placed orders will appear here."
        action={
          <Link to="/" className="button">
            Start shopping
          </Link>
        }
      />
    );

  return (
    <section className="content-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PURCHASE HISTORY</span>
          <h1>
            My orders<span className="brand-dot">.</span>
          </h1>
        </div>
      </div>
      <div className="orders-list">
        {items.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-head">
              <div>
                <span className="eyebrow">ORDER #{order.id}</span>
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
              </div>
              <span className="order-status">{order.status}</span>
            </div>
            {order.items.map((item) => (
              <div className="order-product" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
            <div className="order-total">
              <span>Order total</span>
              <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
