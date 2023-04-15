const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {  
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    img: {
        type: String
    },
    categories: {
        type: Array
    },
    size: {
        type: Array
    },
    color: {
        type: Array
    },
    status: {
      type: String
    },
    inStock: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Product', ProductSchema);