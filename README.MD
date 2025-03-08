# Inventory Revenue Management System

A comprehensive solution for managing inventory and tracking revenue in real-time.

## Overview

This web application provides businesses with a powerful tool to monitor inventory levels, track sales, analyze revenue streams, and make data-driven decisions. The system combines modern frontend technologies with a robust backend to deliver a seamless user experience.

## Features

- **Inventory Tracking**: Monitor stock levels, set reorder points, and manage product information
- **Revenue Analytics**: Visualize sales data and revenue metrics with interactive dashboards
- **Sales Management**: Process transactions and generate invoices
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Printable Reports**: Generate and print custom reports for inventory and revenue

## Technology Stack

### Frontend
- **React 18**: A JavaScript library for building user interfaces
- **React Router**: For navigation and routing within the application
- **Lucide React**: Modern icon library for clean UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vite**: Next-generation frontend tooling for faster development

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js

### Development Tools
- **TypeScript**: Static type-checking for JavaScript
- **ESLint**: Code linting tool for identifying problematic patterns
- **Nodemon**: Utility for automatically restarting the server during development

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/inventory-revenue-management.git
   cd inventory-revenue-management
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. In a separate terminal, start the backend server
   ```
   npm run server
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Scripts

- `npm run dev`: Start the Vite development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check for code issues
- `npm run preview`: Preview the production build locally
- `npm run server`: Start the backend server


## License

This project is licensed under the MIT License - see the LICENSE file for details.