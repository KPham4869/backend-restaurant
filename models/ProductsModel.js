const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new mongoose.Schema({
    ID_Product: { type: Number, required: true, unique: true }, 
    ID_Type: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    newprice: { type: Number },
    image: { type: String },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
{ timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

module.exports = Product;

