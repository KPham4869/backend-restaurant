const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

// Tạo mới Coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const { name, description, expiry, discount, image } = req.body;

    // Kiểm tra xem coupon với cùng tên đã tồn tại chưa
    const existingCoupon = await Coupon.findOne({ name });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon name must be unique." });
    }

    // Tạo coupon mới
    const newCoupon = await Coupon.create({
      name,
      description,
      expiry,
      discount,
      image,
    });

    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy danh sách tất cả các Coupon
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const { name, description, expiry, discount, image } = req.body;

    // Tìm và cập nhật coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { name, description, expiry, discount, image },
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xóa Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy thông tin một Coupon
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};


