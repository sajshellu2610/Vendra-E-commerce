
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addToCartAsync } from '../redux/slices/cartSlice';
import { toggleWishlistAsync } from '../redux/slices/wishlistSlice';
import EmptyState from '../components/EmptyState';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.auth.user);

  // Move product
  const handleMoveToCart = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (Number(item.stock) < 1) return;

    try {
      const result = await dispatch(
        addToCartAsync({
          userId: user.id,
          product: {
            ...item,
            quantity: 1,
          },
        })
      );

      // Remove from 
      if (addToCartAsync.fulfilled.match(result)) {
        await dispatch(
          toggleWishlistAsync({
            userId: user.id,
            product: item,
          })
        );
      }
    } catch (error) {
      console.error('Move to cart failed:', error);
    }
  };

  // Remove product
  const handleRemove = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(
      toggleWishlistAsync({
        userId: user.id,
        product: item,
      })
    );
  };

  if (!items.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Save products you want to come back to."
        action={
          <Link to="/" className="button">
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <section className="content-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SAVED FOR LATER</span>

          <h1>
            Your wishlist<span className="brand-dot">.</span>
          </h1>
        </div>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <article className="product-card" key={item.id}>
            <div className="product-image-wrap">
              <Link to={`/products/${item.id}`}>
                <img
                  src={
                    item.image ||
                    '/images/product-placeholder.svg'
                  }
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      '/images/product-placeholder.svg';
                  }}
                />
              </Link>
            </div>

            <div className="product-info">
              <span className="eyebrow">{item.category}</span>

              <Link
                className="product-name"
                to={`/products/${item.id}`}
              >
                {item.name}
              </Link>

              <strong>
                ₹{Number(item.price).toLocaleString('en-IN')}
              </strong>

              <button
                className="button add-button"
                disabled={Number(item.stock) < 1}
                onClick={() => handleMoveToCart(item)}
              >
                Move to cart
              </button>

              <button
                className="text-button"
                onClick={() => handleRemove(item)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
