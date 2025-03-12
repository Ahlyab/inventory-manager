import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { fetchProduct, updateProduct, updateStock } from "../api";
import { AxiosError } from "axios";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    sku: "",
  });
  const [stockOperation, setStockOperation] = useState({
    operation: "add",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [error, setError] = useState("");
  const [stockError, setStockError] = useState("");
  const [stockSuccess, setStockSuccess] = useState("");

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const fetchProductData = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetchProduct(productId);
      const product = response.data;

      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock: product.stock.toString(),
        category: product.category || "",
        sku: product.sku || "",
      });
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStockOperation({ ...stockOperation, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.price || !formData.cost) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
      };

      await updateProduct(id!, productData);
      navigate("/inventory");
    } catch (err) {
      console.error("Error updating product:", err);
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update product");
      } else {
        setError("Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockOperation.quantity || parseInt(stockOperation.quantity) <= 0) {
      setStockError("Please enter a valid quantity");
      return;
    }

    try {
      setStockLoading(true);
      setStockError("");
      setStockSuccess("");

      const response = await updateStock(
        id!,
        stockOperation.operation,
        parseInt(stockOperation.quantity)
      );

      setFormData({
        ...formData,
        stock: response.data.stock.toString(),
      });

      setStockSuccess("Stock updated successfully");
      setStockOperation({ ...stockOperation, quantity: "" });
    } catch (err) {
      console.error("Error updating stock:", err);
      if (err instanceof AxiosError) {
        setStockError(err.response?.data?.message || "Failed to update stock");
      } else {
        setStockError("Failed to update stock");
      }
    } finally {
      setStockLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/inventory")}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="sku"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cost Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    readOnly
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/inventory")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save size={18} className="mr-1" />
                      Save Changes
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Update Stock</h2>

            {stockError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{stockError}</span>
              </div>
            )}

            {stockSuccess && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{stockSuccess}</span>
              </div>
            )}

            <form onSubmit={handleStockUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="operation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Operation
                </label>
                <select
                  id="operation"
                  name="operation"
                  value={stockOperation.operation}
                  onChange={handleStockChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="add">Add Stock</option>
                  <option value="subtract">Remove Stock</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={stockOperation.quantity}
                  onChange={handleStockChange}
                  min="1"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={stockLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {stockLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Stock"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
