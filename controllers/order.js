const Order = require('../models/Order');

const test = (req, res) => {
  res.send('Test Order sucessfull !!');
}

const create = async (req, res) => {
  const {userId, products, amount, address, status} = req.body;
  const newOrder = new Order({
    userId,
    products,
    amount,
    address,
    status
  });
  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder._doc);
  } catch(err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate order
      return res.status(422).send({ succes: false, message: 'Order already exist!' });
    }
    return res.status(500).json(err);
  }
};

const update = async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set: req.body
      },
      {new: true});
      return res.status(200).json(updatedOrder);
    } catch(err) {
      return res.status(500).json(err);
    }
};

const destroy = async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id)
    return res.status(200).json('Order deleted');
  } catch(err) {
    return res.status(500).json(err);
  }
};

const destroyAll = async (req, res) => {
  try {
    const result = await Order.deleteMany();
    return res.status(200).json(`All Orders deleted`);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    return res.status(200).json(order || {});
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({userId: req.params.id});
    return res.status(200).json(orders || []);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getAllOrders = async (req, res) => {
  const { latest , products, status } = req.query;
  try {
    let orders;
    if (latest) {
      orders = await Order.find().sort({ createdAt: -1}).limit(50);
    } else if (products) {
      orders = await Order.find({
        products: {
          $elemMatch: {
            productId: {
              $in: [products]
            }
          }  
        },
      })
    } else if (status) {
      orders = await Order.find({status});
    } else {
      orders = await Order.find();
    }
    return res.status(200).json(orders || []);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getNewOrdersByMonthStats = async(req, res) => {
  
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try {
    const result = await Order.aggregate([
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

const getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() -1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
  try {
    const income = await Order.aggregate([
      { 
        $match: { 
          createdAt: { 
            $gte: previousMonth
          }
        }
      },
      {
        $project: {
          month: { $month: '$createdAt'},
          sales: '$amount'
        },
      },
      {
        $group: {
          _id: '$month',
          total: {
            $sum:'$sales'
          },
        },
      },
    ]);
    return res.status(200).json(income);
  } catch (err) {
    return res.status(500).json({success: false, error: err});
  }
}

module.exports = {
  create,
  update,
  destroy,
  destroyAll,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  getNewOrdersByMonthStats,
  getMonthlyIncome,
  test
};
