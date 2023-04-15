const Product = require('../models/Product');

const test = (req, res) => {
  res.send('Test Product sucessfull !!');
}

const create = async (req, res) => {
  const {title, desc, img, categories, size, color, price, quantity, status, active, inStock } = req.body;
  const newProduct = new Product({
    title,
    desc,
    img,
    categories,
    size,
    color,
    price,
    quantity,
    status,
    active,
    inStock
  });
  try {
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct._doc);
  } catch(err) {
    // console.log({name: err.name, code: err.code})
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate username
      return res.status(422).send({ succes: false, message: 'Product title already exist!' });
    }
    return res.status(500).json(err);
  }
};

const destroyMany = async (req, res) => {
  const { ids } = req.body;
  console.log({ids});
  try {
    const result = await Product.deleteMany({
      _id: {
        $in: ids
      }
    })
    return res.status(200).json('Products deleted');
  } catch(err) {
    return res.status(500).json(err);
  }
};

const update = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
      },
      {new: true});
      return res.status(200).json(updatedProduct);
    } catch(err) {
      return res.status(500).json(err);
    }
};

const destroy = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id)
    return res.status(200).json('Product deleted');
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    console.log('--product--',product);
    return res.status(200).json(product || {});
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getAllProducts = async (req, res) => {
  const { latest , category } = req.query;
  try {
    let products;
    if (latest) {
      products = await Product.find().sort({ createdAt: -1}).limit(50);
    } else if (category) {
      products = await Product.find({
        categories: {
          $in: [category],
        },
      })
    } else {
      products = await Product.find();
    }
    return res.status(200).json(products || []);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getNewProductByMonthStats = async(req, res) => {
  
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try {
    const result = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastYear
          }
        }
      },
      {
        $project: {
          month: {
            $month: '$createdAt'
          },
        },
      },
      {
        $group: {
          _id: '$month',
          total: {
            $sum: 1
          }
        }
      }
    ])
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
}

module.exports = {
  create,
  destroyMany,
  update,
  destroy,
  getProductById,
  getAllProducts,
  getNewProductByMonthStats,
  test
};