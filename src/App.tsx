import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Sales from "./pages/Sales";
import CreateSale from "./pages/CreateSale";
import SaleDetails from "./pages/SaleDetails";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/add" element={<AddProduct />} />
            <Route path="/inventory/edit/:id" element={<EditProduct />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/create" element={<CreateSale />} />
            <Route path="/sales/:id" element={<SaleDetails />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
