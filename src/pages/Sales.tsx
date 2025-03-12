import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Search, ArrowUpDown, Calendar } from "lucide-react";
import { fetchSales } from "../api";

interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  customerContact?: string;
  items: { product: string; quantity: number }[];
  total: number;
  paymentStatus: "paid" | "partial" | "pending";
  createdAt: string;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetchSales();
      setSales(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilter({ ...dateFilter, [name]: value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Apply sorting and filtering
  const filteredSales = [...sales]
    .filter((sale: Sale) => {
      // Search filter
      const matchesSearch =
        sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.customerName &&
          sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Date filter
      let matchesDate = true;
      if (dateFilter.startDate && dateFilter.endDate) {
        const saleDate = new Date(sale.createdAt);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59); // Set to end of day

        matchesDate = saleDate >= startDate && saleDate <= endDate;
      }

      return matchesSearch && matchesDate;
    })
    .sort((a: Sale, b: Sale) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      const aValue =
        sortField === "customerName"
          ? a.customerName || ""
          : sortField === "invoiceNumber"
          ? a.invoiceNumber
          : sortField === "total"
          ? a.total
          : sortField === "paymentStatus"
          ? a.paymentStatus
          : "";

      const bValue =
        sortField === "customerName"
          ? b.customerName || ""
          : sortField === "invoiceNumber"
          ? b.invoiceNumber
          : sortField === "total"
          ? b.total
          : sortField === "paymentStatus"
          ? b.paymentStatus
          : "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <Link
          to="/sales/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-1" />
          New Sale
        </Link>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by invoice or customer..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center">
                <span className="mx-2">to</span>
                <input
                  type="date"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("invoiceNumber")}
                >
                  <div className="flex items-center">
                    Invoice #
                    {sortField === "invoiceNumber" && (
                      <ArrowUpDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customerName")}
                >
                  <div className="flex items-center">
                    Customer
                    {sortField === "customerName" && (
                      <ArrowUpDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Total
                    {sortField === "total" && (
                      <ArrowUpDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("paymentStatus")}
                >
                  <div className="flex items-center">
                    Payment Status
                    {sortField === "paymentStatus" && (
                      <ArrowUpDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "createdAt" && (
                      <ArrowUpDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale: Sale) => (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.customerName || "Walk-in Customer"}
                      </div>
                      {sale.customerContact && (
                        <div className="text-xs text-gray-500">
                          {sale.customerContact}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {sale.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sale.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : sale.paymentStatus === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sale.paymentStatus.charAt(0).toUpperCase() +
                          sale.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(sale.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link
                        to={`/sales/${sale._id}`}
                        className="text-indigo-600 hover:text-indigo-900 flex justify-center"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
