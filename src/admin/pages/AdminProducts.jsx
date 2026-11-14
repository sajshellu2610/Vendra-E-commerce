
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/slices/productSlice";

import "../styles/admin.css";

const PAGE_SIZE = 8;

const emptyForm = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "",
};

export default function AdminProducts() {
  const dispatch = useDispatch();

  const { items = [], loading, error } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Search products
  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return items.filter((product) => {
      const title = String(
        product.title || product.name || ""
      ).toLowerCase();

      const category = String(
        product.category || ""
      ).toLowerCase();

      return (
        title.includes(searchValue) ||
        category.includes(searchValue)
      );
    });
  }, [items, search]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Open add modal
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      title: product.title || product.name || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock ?? "",
    });

    setShowModal(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Close modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.price ||
      !formData.image.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (
      Number(formData.price) < 0 ||
      (formData.stock !== "" && Number(formData.stock) < 0)
    ) {
      toast.error("Price and stock cannot be negative");
      return;
    }

    const productData = {
      title: formData.title.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      stock: Number(formData.stock || 0),
    };

    try {
      setSaving(true);

      if (editingProduct) {
        await dispatch(
          updateProduct({
            id: editingProduct.id,
            productData,
          })
        ).unwrap();

        toast.success("Product updated successfully");
      } else {
        await dispatch(addProduct(productData)).unwrap();

        toast.success("Product added successfully");
        setCurrentPage(1);
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData(emptyForm);
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();

      toast.success("Product deleted successfully");

      const remainingCount = filteredProducts.length - 1;
      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingCount / PAGE_SIZE)
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Failed to delete product"
      );
    }
  };

  // Search handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="admin-page">

      {/* Heading */}
      <div className="admin-page-heading">
        <div>
          <h1>Products</h1>
          <p>Manage your Vendra store products</p>
        </div>

        <button
          className="admin-add-product-btn"
          onClick={handleAdd}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product Summary */}
      <div className="admin-product-summary">
        <div className="admin-product-summary-icon">
          <Package size={24} />
        </div>

        <div>
          <p>Total Products</p>
          <h2>{items.length}</h2>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="admin-products-toolbar">
        <div className="admin-products-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <span className="admin-product-count">
          {filteredProducts.length} products found
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* Product Table */}
      <div className="admin-panel">
        {loading && items.length === 0 ? (
          <div className="admin-loading">
            Loading products...
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="admin-empty">
            <Package size={40} />
            <h3>No products found</h3>
            <p>
              {search
                ? "Try another search term."
                : "Add your first product to get started."}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((product) => {
                  const stock = Number(product.stock ?? 0);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-info">
                          <img
                            className="admin-product-image"
                            src={product.image}
                            alt={product.title || product.name}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />

                          <div className="admin-product-details">
                            <strong>
                              {product.title || product.name}
                            </strong>
                            <span>ID: {product.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-product-category">
                          {product.category || "N/A"}
                        </span>
                      </td>

                      <td className="admin-product-price">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`admin-stock-status ${
                            stock === 0
                              ? "out-of-stock"
                              : stock <= 5
                                ? "low-stock"
                                : ""
                          }`}
                        >
                          {stock === 0
                            ? "Out of stock"
                            : stock <= 5
                              ? `${stock} left`
                              : stock}
                        </span>
                      </td>

                      <td>
                        <div className="admin-product-actions">
                          <button
                            className="admin-product-action-btn"
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="admin-product-action-btn delete"
                            onClick={() => handleDelete(product.id)}
                            title="Delete product"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="admin-products-pagination">
            <p>
              Page {currentPage} of {totalPages}
            </p>

            <div className="admin-products-page-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="admin-product-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="admin-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-product-modal-header">
              <div>
                <h2>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information"
                    : "Enter the new product information"}
                </p>
              </div>

              <button
                type="button"
                className="admin-product-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="admin-product-form"
            >
              <div className="admin-product-form-grid">

                <div className="admin-product-form-group">
                  <label htmlFor="product-title">Product Name *</label>
                  <input
                    id="product-title"
                    type="text"
                    name="title"
                    placeholder="Enter product name"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-product-form-group">
                  <label htmlFor="product-category">Category *</label>
                  <select
                    id="product-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Phones">Phones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Keyboards">Keyboards</option>
                    <option value="CPUs">CPUs</option>
                    <option value="Mice">Mice</option>
                  </select>
                </div>

                <div className="admin-product-form-group">
                  <label htmlFor="product-price">Price (₹) *</label>
                  <input
                    id="product-price"
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-product-form-group">
                  <label htmlFor="product-stock">Stock</label>
                  <input
                    id="product-stock"
                    type="number"
                    name="stock"
                    placeholder="Enter stock quantity"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-product-form-group full-width">
                  <label htmlFor="product-image">Image URL *</label>
                  <input
                    id="product-image"
                    type="url"
                    name="image"
                    placeholder="https://example.com/product.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-product-form-group full-width">
                  <label htmlFor="product-description">Description</label>
                  <textarea
                    id="product-description"
                    name="description"
                    placeholder="Enter product description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="admin-product-form-actions">
                <button
                  type="button"
                  className="admin-product-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-product-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
