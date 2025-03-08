import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
              <Package size={24} />
              <span>Inventory Manager</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ${isActive('/')}`}
              >
                <div className="flex items-center space-x-1">
                  <Home size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>
              
              <Link 
                to="/inventory" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ${isActive('/inventory')}`}
              >
                <div className="flex items-center space-x-1">
                  <Package size={18} />
                  <span>Inventory</span>
                </div>
              </Link>
              
              <Link 
                to="/sales" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ${isActive('/sales')}`}
              >
                <div className="flex items-center space-x-1">
                  <ShoppingCart size={18} />
                  <span>Sales</span>
                </div>
              </Link>
              
              <Link 
                to="/reports" 
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ${isActive('/reports')}`}
              >
                <div className="flex items-center space-x-1">
                  <BarChart3 size={18} />
                  <span>Reports</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-indigo-700">
        <div className="grid grid-cols-4 text-center">
          <Link 
            to="/" 
            className={`py-3 ${isActive('/')}`}
          >
            <Home size={20} className="mx-auto" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link 
            to="/inventory" 
            className={`py-3 ${isActive('/inventory')}`}
          >
            <Package size={20} className="mx-auto" />
            <span className="text-xs">Inventory</span>
          </Link>
          
          <Link 
            to="/sales" 
            className={`py-3 ${isActive('/sales')}`}
          >
            <ShoppingCart size={20} className="mx-auto" />
            <span className="text-xs">Sales</span>
          </Link>
          
          <Link 
            to="/reports" 
            className={`py-3 ${isActive('/reports')}`}
          >
            <BarChart3 size={20} className="mx-auto" />
            <span className="text-xs">Reports</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;