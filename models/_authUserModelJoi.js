const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  confirmPassword: {
  type: String,
  required: [true, 'Please confirm your password'],
  validate: {
    validator: function(pass) {
      return pass === this.password;
    },
  message: 'Passwords are not the same!'
  }
  },
  biz: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);

const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(250)
      .required(),
    email: Joi.string()
      .min(6)
      .max(250)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(250)
      .required(),
    biz: Joi.boolean().required()
  });

  return schema.validate(user);
};
module.exports = { User, validateUser };