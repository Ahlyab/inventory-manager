import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { fetchSale } from "../api";
import { useReactToPrint } from "react-to-print";

interface SaleItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
  product: string;
}

interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  customerContact?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "upi" | "other";
  paymentStatus: "paid" | "pending" | "partial";
  notes?: string;
  createdAt: string;
}

const SaleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchSaleData(id);
    }
  }, [id]);

  const fetchSaleData = async (saleId: string) => {
    try {
      setLoading(true);
      const response = await fetchSale(saleId);
      setSale(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching sale:", err);
      setError("Failed to load sale details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${sale?.invoiceNumber}`,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || "Sale not found"}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/sales")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">Sale Details</h1>
        </div>
        <button
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Printer size={20} className="mr-1" />
          Print Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6" ref={printRef}>
          <div className="print:text-black">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-600 mt-1">#{sale.invoiceNumber}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <h3 className="font-bold text-gray-800">
                  AM COSMETICS AND PERFUME
                </h3>
                <p className="text-gray-600">Shop # 82/E Resham Gali</p>
                <p className="text-gray-600">Arifwala, Punjab, PK</p>
                <p className="text-gray-600">Phone: 0303-3249998</p>
              </div>
            </div>

            {/* Customer & Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Bill To:</h3>
                <p className="text-gray-700 font-medium">
                  {sale.customerName || "Walk-in Customer"}
                </p>
                {sale.customerContact && (
                  <p className="text-gray-600">{sale.customerContact}</p>
                )}
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="font-bold text-gray-800">Invoice Date:</span>
                  <span className="text-gray-600 ml-2">
                    {formatDate(sale.createdAt)}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-gray-800">
                    Payment Status:
                  </span>
                  <span
                    className={`ml-2 ${
                      sale.paymentStatus === "paid"
                        ? "text-green-600"
                        : sale.paymentStatus === "partial"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {sale.paymentStatus.charAt(0).toUpperCase() +
                      sale.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Payment Method:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {sale.paymentMethod.charAt(0).toUpperCase() +
                      sale.paymentMethod.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left font-medium text-gray-700 uppercase tracking-wider border-b">
                      Item
                    </th>
                    <th className="py-3 px-4 text-right font-medium text-gray-700 uppercase tracking-wider border-b">
                      Price
                    </th>
                    <th className="py-3 px-4 text-right font-medium text-gray-700 uppercase tracking-wider border-b">
                      Quantity
                    </th>
                    <th className="py-3 px-4 text-right font-medium text-gray-700 uppercase tracking-wider border-b">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sale.items.map((item: SaleItem, index: number) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-gray-800 text-right">
                        Rs. {item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-800 text-right">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-gray-800 text-right">
                        Rs. {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-700">Subtotal:</span>
                  <span className="text-gray-800">
                    Rs. {sale.subtotal.toFixed(2)}
                  </span>
                </div>
                {sale.tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700">
                      Tax ({sale.tax}%):
                    </span>
                    <span className="text-gray-800">
                      Rs. {((sale.subtotal * sale.tax) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {sale.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700">Discount:</span>
                    <span className="text-gray-800">
                      Rs. {sale.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-800">
                    Rs. {sale.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-2">Notes:</h3>
                <p className="text-gray-600">{sale.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-600 border-t border-gray-200 pt-4">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetails;
