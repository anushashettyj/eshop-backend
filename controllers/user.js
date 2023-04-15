const bcrypt = require('bcrypt');
const User = require('../models/User');

const create = async (req, res) => {
  const {
    username,
    tagline,
    name,
    email,
    gender,
    isAdmin,
    img,
    alt,
    phone,
    address,
    status,
    lastActiveAt 
  } = req.body;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username,
    tagline,
    name,
    email,
    password,
    gender,
    isAdmin,
    img,
    alt,
    phone,
    address,
    status,
    lastActiveAt
  });
  try {
    const user = await User.findOne({$or: [{email: email},{username: username}]});
    if (user && (user.email === email)) {
      return res.status(409).json('Email already exists');
    }
    if (user && (user.username === username)) {
      return res.status(409).json('Username already exists');
    }
    const savedUser = await newUser.save();
    const { password, ...other} = savedUser._doc;
    return res.status(201).json(other)
  } catch (err) {
    return res.status(500).json(err);
  }
};

const update = async (req, res) => {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      },
      {new: true});
      const { password, ...user} = updatedUser._doc;
      return res.status(200).json({...user});
    } catch(err) {
      return res.status(500).json(err);
    }
};

const destroy = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id)
    console.log(result);
    return res.status(200).json('User deleted');
  } catch(err) {
    return res.status(500).json(err);
  }
};

const destroyMany = async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await User.deleteMany({
      _id: {
        $in: ids
      }
    });
    return res.status(200).json('Users deleted');
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await User.findById(req.params.id)
    const {password, ...user} = result._doc;
    return res.status(200).json(user);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  const { latest, limit } = req.query;
  console.log({latest, limit})
  console.log({req});
  try {
    let options = {};
    if (latest) {
      options.sort = {
        $natural:1
      }
    }
    if (limit) {
      options.limit = limit;
    }
    const result = await User.find({}, {}, options);
    return res.status(200).json(result);
  } catch(err) {
    return res.status(500).json(err);
  }
};

const getNewUserByMonthStats = async(req, res) => {
  
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try {
    const result = await User.aggregate([
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

const test = (req, res) => {
    res.send('Test sucessfull !!');
}

module.exports = {
    create,
    update,
    destroy,
    destroyMany,
    getUserById,
    getAllUsers,
    getNewUserByMonthStats,
    test
};
