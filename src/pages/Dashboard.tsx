import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { fetchProducts, fetchSalesStats } from "../api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, statsResponse] = await Promise.all([
          fetchProducts(),
          fetchSalesStats(),
        ]);

        const products = productsResponse.data;
        const lowStockItems = products.filter(
          (product: any) => product.stock < 5
        ).length;

        setStats({
          totalProducts: products.length,
          totalSales: statsResponse.data.totalSales,
          totalRevenue: statsResponse.data.totalRevenue,
          lowStockItems,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Products
              </p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
          <Link
            to="/inventory"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium mt-4 inline-block"
          >
            View Inventory →
          </Link>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Sales</p>
              <p className="text-2xl font-bold">{stats.totalSales}</p>
            </div>
          </div>
          <Link
            to="/sales"
            className="text-green-500 hover:text-green-700 text-sm font-medium mt-4 inline-block"
          >
            View Sales →
          </Link>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">
                Rs. {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          <Link
            to="/reports"
            className="text-purple-500 hover:text-purple-700 text-sm font-medium mt-4 inline-block"
          >
            View Reports →
          </Link>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold">{stats.lowStockItems}</p>
            </div>
          </div>
          <Link
            to="/inventory"
            className="text-yellow-500 hover:text-yellow-700 text-sm font-medium mt-4 inline-block"
          >
            Check Inventory →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/inventory/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-center font-medium"
            >
              Add New Product
            </Link>
            <Link
              to="/sales/create"
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center font-medium"
            >
              Create New Sale
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">System Information</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">System:</span> Inventory & Revenue
              Management
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Version:</span> 1.0.0
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
