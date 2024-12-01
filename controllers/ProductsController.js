// controllers/ProductsController.js
const Product = require('../models/ProductsModel');
const path = require('path');
const Type = require('../models/TypesModel');
const { getNextSequence } = require('./CounterController');
const asyncHandler = require('express-async-handler');


// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const {ID_Type, name, description, price, image } = req.body;
    // const imagePath = path.join(__dirname, '../assets/images', image);

    // Lấy ID_Product tự động
    const ID_Product = await getNextSequence('ID_Product');

    // Kiểm tra xem sản phẩm có tồn tại với ID_Product đã cho không
    const existingProduct = await Product.findOne({ ID_Product });
    if (existingProduct) {
      console.log('ID_Product đã tồn tại:', ID_Product);
      return res.status(400).json({ message: 'ID_Product đã tồn tại, không thể thêm sản phẩm' });
    }
    const existingType = await Type.findOne({ ID_Type });
    if (!existingType) {
      console.log('ID_Type không tồn tại:', ID_Type);
      return res.status(400).json({ message: 'ID_Type không tồn tại, không thể thêm sản phẩm' });
    }
    const newproduct = new Product(
      { ID_Product, 
        ID_Type,
        name, 
        description, 
        price,
        image,
       });
    await newproduct.save();
    console.log('Product created:', Product);
    
    res.status(201).json({
      message: 'Thêm sản phẩm thành công',
      Product: newproduct 
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Retrieved all products:', products);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo ID_Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ ID_Product: req.params.id }); // Sử dụng ID_Product để tìm kiếm
    if (!product) {
      console.log('Product not found with ID_Product:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Retrieved product:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm theo ID_Product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { ID_Product: req.params.id }, // Sử dụng ID_Product để tìm kiếm
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      console.log('Product not found for update with ID_Product:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product updated:', updatedProduct);
    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Xóa sản phẩm theo ID_Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ ID_Product: req.params.id }); // Sử dụng ID_Product để tìm kiếm
    if (!product) {
      console.log('Product not found for deletion with ID_Product:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product deleted:', product);
    res.status(200).json({ message: 'Xóa sản phẩm thành công', product }); // Thêm thông báo thành công
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: error.message });
  }
};
// controllers/ProductsController.js
exports.getProductsByType = async (req, res) => {
  try {
    const ID_Type = req.params.type; // Sử dụng ID_Type từ params
    const products = await Product.find({ ID_Type });

    if (products.length === 0) {
      console.log(`No products found for ID_Type: ${ID_Type}`);
      return res.status(404).json({ message: 'No products found for this type' });
    }

    console.log(`Retrieved products for ID_Type: ${ID_Type}`, products);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products by type:', error.message);
    res.status(500).json({ message: error.message });
  }
};
exports.rating = async (req, res) => {
  const { _id } = req.user; // ID người dùng từ JWT
  const { star, productId, comment } = req.body; // Trích xuất thông tin từ body của request
  console.log('Received productId:', productId);
  try {
    // Chuyển đổi productId thành kiểu Number nếu nó là chuỗi
    const prodId = Number(productId);

    // Kiểm tra xem giá trị productId đã được chuyển thành số chưa
    if (isNaN(prodId)) {
      return res.status(400).json({ message: "Invalid productId, must be a number" });
    }
       // In ra giá trị đã chuyển đổi của productId
    console.log('Converted productId:', prodId);

    // Tìm sản phẩm theo ID
    const product = await Product.findOne({ ID_Product: prodId });
    console.log('Found product:', product);  

    // Kiểm tra nếu sản phẩm không tồn tại
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Kiểm tra nếu người dùng đã đánh giá sản phẩm
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      // Nếu đã đánh giá, cập nhật đánh giá
      await Product.updateOne(
        { ID_Product: prodId, "ratings.postedby": _id },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        }
      );
    } else {
      // Nếu chưa đánh giá, thêm đánh giá mới
      await Product.findByIdAndUpdate(
        product._id,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        }
      );
    }

    // Cập nhật tổng điểm của sản phẩm sau khi đánh giá
    const updatedProduct = await Product.findOne({ ID_Product: prodId });

    // Tính lại tổng điểm trung bình
    let totalRating = updatedProduct.ratings.length;
    let ratingSum = updatedProduct.ratings.reduce((sum, rating) => sum + rating.star, 0);
    let actualRating = totalRating > 0 ? Math.round(ratingSum / totalRating) : 0;

    // Cập nhật lại tổng điểm của sản phẩm
    await Product.findByIdAndUpdate(updatedProduct._id, { totalrating: actualRating });

    // Trả về phản hồi thành công
    res.status(200).json({ message: 'Rating processed successfully' });
  } catch (error) {
    console.error('Error processing rating:', error.message);
    res.status(400).json({ message: error.message });
  }
};
