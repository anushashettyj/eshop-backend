const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
  res.send('Auth Test sucessfull !!');
}

const register = async (req, res) => {
  const { username, name, email, isAdmin, status, gender } = req.body;
  // generate random 10 char string (salt)
  const salt = await bcrypt.genSalt(10);
  // hash the password, it cannot be reversed back to plain text
  // 1 way encryption
  const password = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username,
    name,
    email,
    password,
    isAdmin,
    status,
    gender
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
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username : req.body.username});
    if (!user) {
      return res.status(401).json('Username does not exist');
    }
    // bcrypt hashes the i/p password, compare with stored hash
    const isPwd = await bcrypt.compare(req.body.password, user.password);
    if (isPwd) {
      const {password, ...other} = user._doc;
      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '3d'
      });
      return res.status(200).json({...other, accessToken});
    } else {
      return res.status(401).json('Incorrect password');
    }
    
  } catch (err) {
    return res.status(500).json(err);
  }
}

module.exports = {
  register,
  login,
  test
}