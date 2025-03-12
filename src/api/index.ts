import axios from 'axios';

const API = axios.create({ baseURL: 'https://inventory-manager-topaz.vercel.app/api' });

// Product API calls
export const fetchProducts = () => API.get('/products');
export const fetchProduct = (id: string) => API.get(`/products/${id}`);
export const createProduct = (product: any) => API.post('/products', product);
export const updateProduct = (id: string, product: any) => API.patch(`/products/${id}`, product);
export const deleteProduct = (id: string) => API.delete(`/products/${id}`);
export const updateStock = (id: string, operation: string, quantity: number) => 
  API.patch(`/products/${id}/stock`, { operation, quantity });

// Sales API calls
export const fetchSales = () => API.get('/sales');
export const fetchSale = (id: string) => API.get(`/sales/${id}`);
export const createSale = (sale: any) => API.post('/sales', sale);
export const fetchSalesStats = (startDate?: string, endDate?: string) => {
  let url = '/sales/stats/revenue';
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return API.get(url);
};