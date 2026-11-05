
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { addToCartAsync } from '../redux/slices/cartSlice';
import { toggleWishlistAsync } from '../redux/slices/wishlistSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const saved = useSelector((state) =>
    state.wishlist.items.some(
      (item) => String(item.id) === String(product.id)
    )
  );

  // Add to Cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add products to your cart!');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        addToCartAsync({
          userId: user.id,
          product,
        })
      ).unwrap();

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Unable to add product to cart.');
    }
  };

  // Wishlist
  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please login to manage your wishlist!');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        toggleWishlistAsync({
          userId: user.id,
          product,
        })
      ).unwrap();

      if (saved) {
        toast.info(`${product.name} removed from wishlist.`);
      } else {
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error) {
      toast.error('Unable to update wishlist.');
    }
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button
          className={`wishlist-button ${saved ? 'saved' : ''}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>

        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
        >
          <img
            src={product.image || '/images/product-placeholder.svg'}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = '/images/product-placeholder.svg';
            }}
          />
        </Link>

        {product.stock === 0 && (
          <span className="stock-badge">Out of stock</span>
        )}
      </div>

      <div className="product-info">
        <span className="eyebrow">
          {product.category} · {product.brand}
        </span>

        <Link
          to={`/products/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="price-row">
          <strong>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </strong>

          {product.oldPrice > product.price && (
            <del>
              ₹{Number(product.oldPrice).toLocaleString('en-IN')}
            </del>
          )}
        </div>

        <button
          className="button add-button"
          disabled={product.stock < 1}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </article>
  );
}
