// routes/orders.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderById,
} = require("../controllers/OrdersController");

const authMiddleware = require('../middlewares/authMiddleware')


router.post("/", authMiddleware, createOrder);
router.get("/myorders/:username", authMiddleware, getMyOrders);
router.get("/all", getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, updateOrderById);

module.exports = router;
