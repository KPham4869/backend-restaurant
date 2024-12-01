const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const productRoutes = require("./routes/products.route");
const orderRoutes = require("./routes/orders.route");
const userRoutes = require("./routes/users");
const orderDetailRoutes = require("./routes/OrderDetailRoute");
const typeRoutes = require("./routes/Types.route");
const cartRouutes = require("./routes/CartRoute");
const couponRoutes = require ("./routes/couponRoute")
const paymentRoutes = require("./routes/payment.route");
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const mongoose = require ("mongoose");
require("dotenv").config();


const app = express();

// Kết nối đến cơ sở dữ liệu
//connectDB();
// Lấy URL từ biến môi trường
const DB_URI = process.env.MONGODB_URI;

// Kết nối MongoDB
mongoose
  .connect(DB_URI)
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/uploads', express.static(path.join(__dirname, 'assets/images'))); // Serve uploaded files
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orderdetails", orderDetailRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/carts", cartRouutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);

// Kết nối MongoDB
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Cấu hình multer để tùy chỉnh đường dẫn lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/images'); // Đường dẫn lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất với timestamp
    }
});
const upload = multer({ storage: storage });

// Route upload file
app.post('/api/uploads', upload.any(), (req, res) => {
    console.log('object')
    if (req.files && req.files.length > 0) {
        console.log(req.files)
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            storedName: file.filename,
            path: file.path
        }));
        res.json({ message: 'Upload thành công', files: uploadedFiles });
    } else {
        res.status(400).json({ message: 'Không có file nào được gửi lên' });
    }
});


// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
module.exports = app;
