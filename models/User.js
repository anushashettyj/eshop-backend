const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {  
    username: {
        type: String,
        required: true,
        unique: true
    },
    tagline: {
      type: String,
      default: 'I love shopping',
    },
    name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
      type: String,
      required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    img: {
      type: String
    },
    alt: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    status: {
      type: String,
      required: true
    },
    isLogged: {
      type: Boolean,
    },
    lastActiveAt: {
      type: Date
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);
