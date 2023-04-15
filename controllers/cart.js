const Cart = require('../models/Cart');

const test = (req, res) => {
  res.send('Test CART sucessfull !!');
}

const create = async (req, res) => {
  const {userId, products } = req.body;
  const newCart = new Cart({
    userId,
    products
  });
  try {
    const savedCart = await newCart.save();
    return res.status(200).json(newCart._doc);
  } catch(err) {
    console.log({name: err.name, code: err.code})
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate Cart record
      return res.status(422).send({ succes: false, message: 'Duplicate record!' });
    }
    return res.status(500).json(err);
  }
};

const update = async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: req.body
      },
      {new: true});
      return res.status(200).json(updatedCart);
    } catch(err) {
      return res.status(500).json(err);
    }
};

const destroy = async (req, res) => {
  try {
    const result = await Cart.findByIdAndDelete(req.params.id)
    console.log('--deleted --', result);
    return res.status(200).json(`Cart record deleted`);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const destroyAll = async (req, res) => {
  try {
    const result = await Cart.deleteMany();
    return res.status(200).json(`All Cart records deleted`);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
    return res.status(200).json(cart || {});
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getAllCarts = async (req, res) => {
  const { latest , products, userId } = req.query;
  try {
    let carts;
    if (latest) {
      carts = await Cart.find().sort({ createdAt: -1}).limit(50);
    } else if (products) {
      carts = await Cart.find({
        products: {
          $elemMatch: {
            productId: {
              $in: [products]
            }
          }  
        },
      })
    } else if (userId) {
      carts = await Cart.find({userId});
    } else {
      carts = await Cart.find();
    }
    return res.status(200).json(carts || []);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getNewCartByMonthStats = async(req, res) => {
  
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try {
    const result = await Cart.aggregate([
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
  update,
  destroy,
  getCartById,
  getAllCarts,
  getNewCartByMonthStats,
  destroyAll,
  test
};