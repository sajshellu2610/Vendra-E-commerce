
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>VENDRA.</strong>
        <span> Gear up for what’s next.</span>
      </div>

      <div className="footer-links">
        <h3>Explore</h3>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <small>
        © {new Date().getFullYear()} Vendra Tech Store. Demo project.
      </small>
    </footer>
  );
}
