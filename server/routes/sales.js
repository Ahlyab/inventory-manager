import express from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single sale
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new sale
router.post("/", async (req, res) => {
  try {
    const { items, ...saleData } = req.body;

    // Generate invoice number (simple implementation)
    const date = new Date();
    const invoiceNumber = `INV-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    // Create new sale
    const newSale = new Sale({
      ...saleData,
      invoiceNumber,
      items,
      createdAt: date,
    });

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save();
    }

    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sales statistics
router.get("/stats/revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      // Create start date at beginning of day (00:00:00)
      const parsedStartDate = new Date(startDate);
      parsedStartDate.setUTCHours(0, 0, 0, 0);

      // Create end date at end of day (23:59:59.999)
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setUTCHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: parsedStartDate,
        $lte: parsedEndDate,
      };
    }

    // Debug the constructed query
    console.log("Query:", JSON.stringify(query));

    const sales = await Sale.find(query);
    console.log(
      `Found ${sales.length} sales between ${startDate} and ${endDate}`
    );

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = sales.length;

    res.status(200).json({
      totalRevenue,
      totalSales,
      averageSale: totalSales > 0 ? totalRevenue / totalSales : 0,
    });
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
