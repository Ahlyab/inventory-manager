import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { fetchSales, fetchProducts, fetchSalesStats } from "../api";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageSale: 0,
    topProducts: [],
    revenueByDay: [],
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const [salesResponse, productsResponse, statsResponse] =
        await Promise.all([
          fetchSales(),
          fetchProducts(),
          fetchSalesStats(dateRange.startDate, dateRange.endDate),
        ]);

      const sales = salesResponse.data;
      const products = productsResponse.data;

      console.log(sales);

      // Filter sales by date range
      const filteredSales = sales.filter((sale: any) => {
        const saleDate = new Date(sale.createdAt);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59); // Set to end of day

        return saleDate >= startDate && saleDate <= endDate;
      });

      // Calculate top products
      const productSales: any = {};
      filteredSales.forEach((sale: any) => {
        sale.items.forEach((item: any) => {
          if (productSales[item.product]) {
            productSales[item.product].quantity += item.quantity;
            productSales[item.product].total += item.total;
          } else {
            productSales[item.product] = {
              id: item.product,
              name: item.name,
              quantity: item.quantity,
              total: item.total,
            };
          }
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 5);

      // Calculate revenue by day
      const revenueByDay: any = {};
      filteredSales.forEach((sale: any) => {
        const date = new Date(sale.createdAt).toISOString().split("T")[0];
        if (revenueByDay[date]) {
          revenueByDay[date] += sale.total;
        } else {
          revenueByDay[date] = sale.total;
        }
      });

      const revenueData = Object.entries(revenueByDay)
        .map(([date, total]) => ({
          date,
          total,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setStats({
        totalRevenue: statsResponse.data.totalRevenue,
        totalSales: statsResponse.data.totalSales,
        averageSale: statsResponse.data.averageSale,
        topProducts,
        revenueByDay: revenueData,
      });

      console.log("stats-----", statsResponse);

      setError("");
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar size={20} className="mr-2" />
            Date Range
          </h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">From:</span>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">To:</span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">
                Rs. {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Sales</p>
              <p className="text-2xl font-bold">{stats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Sale</p>
              <p className="text-2xl font-bold">
                Rs. {stats.averageSale.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          {stats.revenueByDay.length > 0 ? (
            <div className="h-64">
              <div className="flex h-full items-end space-x-2">
                {stats.revenueByDay.map((day: any, index: number) => {
                  const maxRevenue = Math.max(
                    ...stats.revenueByDay.map((d: any) => d.total)
                  );
                  const height = (day.total / maxRevenue) * 100;
                  console.log("----height", height);

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-full bg-indigo-500 rounded-t h-2 h-[calc(${height}%)]`}
                      ></div>
                      <div className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                        {formatDate(day.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No revenue data available for the selected period
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          {stats.topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topProducts.map((product: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        Rs. {product.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No product data available for the selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
