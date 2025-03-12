import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, ShoppingCart } from "lucide-react";
import { fetchProducts, createSale } from "../api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  category?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

interface SaleItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface SaleData {
  customerName: string;
  customerContact: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "upi" | "other";
  paymentStatus: "paid" | "pending" | "partial";
  notes: string;
}

const CreateSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [saleData, setSaleData] = useState<SaleData>({
    customerName: "",
    customerContact: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    paymentMethod: "cash",
    paymentStatus: "paid",
    notes: "",
  });

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [saleData.items, saleData.tax, saleData.discount]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await fetchProducts();
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setSaleData({ ...saleData, [name]: value });
  };

  const handleAddItem = (product: Product) => {
    // Check if product already exists in the cart
    const existingItemIndex = saleData.items.findIndex(
      (item: SaleItem) => item.product === product._id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      const updatedItems = [...saleData.items];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].price *
        updatedItems[existingItemIndex].quantity;

      setSaleData({ ...saleData, items: updatedItems });
    } else {
      // Add new item to cart
      const newItem: SaleItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      };

      setSaleData({ ...saleData, items: [...saleData.items, newItem] });
    }
  };

  const handleUpdateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;

    const updatedItems = [...saleData.items];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total = updatedItems[index].price * quantity;

    setSaleData({ ...saleData, items: updatedItems });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...saleData.items];
    updatedItems.splice(index, 1);

    setSaleData({ ...saleData, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = saleData.items.reduce(
      (sum: number, item: SaleItem) => sum + item.total,
      0
    );
    const taxAmount = (subtotal * saleData.tax) / 100;
    const discountAmount = saleData.discount;
    const total = subtotal + taxAmount - discountAmount;

    setSaleData({
      ...saleData,
      subtotal,
      total,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saleData.items.length === 0) {
      setError("Please add at least one item to the sale");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createSale(saleData);
      navigate("/sales");
    } catch (err: unknown) {
      console.error("Error creating sale:", err);
      setError(err instanceof Error ? err.message : "Failed to create sale");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
          onClick={() => navigate("/sales")}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Create New Sale</h1>
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={saleData.customerName}
                  onChange={handleCustomerChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Walk-in Customer"
                />
              </div>
              <div>
                <label
                  htmlFor="customerContact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="customerContact"
                  name="customerContact"
                  value={saleData.customerContact}
                  onChange={handleCustomerChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Products</h2>
            <div className="mb-4">
              <label
                htmlFor="searchProduct"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Products
              </label>
              <input
                type="text"
                id="searchProduct"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name, SKU, or category"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 max-h-60 overflow-y-auto">
              {filteredProducts.map((product: Product) => (
                <div
                  key={product._id}
                  className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAddItem(product)}
                >
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.category && <span>{product.category} • </span>}
                    <span>Rs. {product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-xs ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `In Stock: ${product.stock}`
                        : "Out of Stock"}
                    </span>
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(product);
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Selected Items</h3>
              {saleData.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {saleData.items.map((item: SaleItem, index: number) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            Rs. {item.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() =>
                                  handleUpdateItemQuantity(
                                    index,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateItemQuantity(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="mx-2 w-12 text-center border border-gray-300 rounded-md shadow-sm py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() =>
                                  handleUpdateItemQuantity(
                                    index,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            Rs. {item.total.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No items added yet. Search and add products above.
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rs. {saleData.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="tax" className="text-gray-600">
                  Tax (%)
                </label>
                <input
                  type="number"
                  id="tax"
                  name="tax"
                  min="0"
                  step="0.01"
                  value={saleData.tax}
                  onChange={handleCustomerChange}
                  className="w-20 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-right focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="discount" className="text-gray-600">
                  Discount (Rs. )
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  min="0"
                  step="0.01"
                  value={saleData.discount}
                  onChange={handleCustomerChange}
                  className="w-20 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-right focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {saleData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={saleData.paymentMethod}
                  onChange={handleCustomerChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={saleData.paymentStatus}
                  onChange={handleCustomerChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={saleData.notes}
                  onChange={handleCustomerChange}
                  rows={2}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/sales")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || saleData.items.length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {submitting ? (
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
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <ShoppingCart size={18} className="mr-1" />
                  Complete Sale
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;
