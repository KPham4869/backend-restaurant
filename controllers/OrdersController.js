// controllers/orderController.js
const Order = require('../models/OrdersModel');
const Cart = require('../models/CartModel');
const asyncHandler = require("express-async-handler");

// Tạo đơn hàng
const createOrder = asyncHandler(async (req, res) => {
  const { username, shippingInfo, paymentInfo, orderItems, totalPrice, totalPriceAfterDiscount } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Invalid order data. Username and order items are required.");
  }

  // Tạo đơn hàng mới
  const order = await Order.create({
    username,
    shippingInfo,
    paymentInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paidAt: paymentInfo?.momoTransactionId ? Date.now() : undefined, // Chỉ gán nếu có thanh toán
  });

  res.status(201).json(order);
});

// Lấy danh sách đơn hàng của người dùng (My Orders)
const getMyOrders = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // Tìm tất cả đơn hàng theo username
  const orders = await Order.find({ username }).sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found for this user.");
  }

  res.status(200).json(orders);
});

// Lấy tất cả đơn hàng (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
  // Tìm tất cả đơn hàng, bao gồm thông tin chi tiết sản phẩm
  const orders = await Order.find().populate("orderItems.product").sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found.");
  }

  res.status(200).json(orders);
});

// Lấy chi tiết đơn hàng theo ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Tìm đơn hàng theo ID
  const order = await Order.findById(id).populate("orderItems.product");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  res.status(200).json(order);
});

// Cập nhật đơn hàng theo ID (Admin)
const updateOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentInfo } = req.body;

  // Tìm và cập nhật đơn hàng
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      paymentInfo: {
        ...paymentInfo,
        momoTransactionId: paymentInfo?.momoTransactionId || undefined,
      },
    },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(404);
    throw new Error("Order not found or failed to update.");
  }

  res.status(200).json(updatedOrder);
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderById,
};

