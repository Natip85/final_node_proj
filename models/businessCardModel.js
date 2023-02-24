const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: [2, 'Name must be at least 2 characters long.'],
    maxlength: [30, 'Name must be under 30 characters.']
  },
  user_id: {
    type: String,
    maxlength: 400
  },
  company_description: {
    type: String,
    maxlength: [3000, 'Max 3000 characters allowed.']
  },
  company_address: {
    type: String,
    maxlength: [250, 'Max 250 characters allowed.']
  },
  company_phone: {
    type: String,
    minlength: [6, 'Phone number is not valid'],
    maxlength: [250, 'Phone number is not valid'],
    match: [/^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Enter a valid phone number'],
    // validate: [validator.isDecimal, 'Please enter a valid phone number']
  },
  company_photo: {
    type: String,
    default: function() {
      if (!this.company_photo) {
        return `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`;
      }
      return this.company_photo;
    }
  },
  card_number: {
    type: Number,
    unique: [true, 'Card number already exists'],
    default: () => Math.floor(100000 + Math.random() * 900000)
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

const Card = mongoose.model('card', cardSchema, 'cards');

module.exports = Card;
