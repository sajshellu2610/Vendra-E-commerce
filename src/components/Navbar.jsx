
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  UserRound,
  LogOut,
  Cpu,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist.items.length
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Cpu size={21} />
          </span>
          VENDRA<span className="brand-dot">.</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          {/* Wishlist */}
          <Link
            className="icon-link wishlist-link"
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="wishlist-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            className="icon-link cart-link"
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingCart size={20} />
            <span>{cartCount}</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">
                <UserRound size={16} />
                {user.name}
              </span>

              <button
                className="text-button"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <Link className="button button-small" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
