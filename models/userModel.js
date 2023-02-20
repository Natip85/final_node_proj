const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  admin:{
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: [true, 'Must submit a name.'],
    maxlength: [100, 'Max 100 characters allowed.'],
    minlength: [1, 'Min 2 characters required.']
  },
  email: {
    type: String,
    unique: true,
    maxlength: [150, 'Max 150 characters allowed.'],
    required: [true, 'Must submit an email.'],
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Min 8 characters required.'],
    maxlength: [200, 'Max 200 characters allowed.'],
    select: false
  },
  confirm_password: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function(pass) {
        return pass === this.password; 
      },
      message: 'Passwords do not match.'
    }
  },
  biz: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// ============================= uscerSchema methods ==========================

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 12); 
  this.confirm_password = undefined; 
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
