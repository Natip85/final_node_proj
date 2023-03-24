const express = require('express');
const router = express.Router();
const fs = require('fs')
const Card = require('../models/businessCardModel');
const verify_logged_in = require('../middleware/verify_logged_in')

/*
* GET http://localhost:3009/api/cards/myCard
*/
router.get('/mycard', verify_logged_in, async (req, res)=>{
  try {
    const decoded = req.user; 
    const myCards = await Card.find({ user_id: decoded.id });
    
    res.status(200).json({
      status: 'Success',
      results: myCards.length,
      data: myCards
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* GET http://localhost:3009/api/cards
*/
router.get('/', verify_logged_in, async (req, res)=>{
  try {
    const allCards = await Card.find({});

    res.status(200).json({
      status: 'Success',
      results: allCards.length,
      data: allCards
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
})

/*
* GET http://localhost:3009/api/cards/21212121212
*/
router.get('/:id', verify_logged_in, async (req, res)=>{
 try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id found.' });
    }
    const oneCard = await Card.findById(id);
    if (!oneCard) {
      return res.status(404).json({ status: 'Fail', message: 'No id found.' });
    }

    res.status(200).json({
      status: 'Success',
      data: oneCard
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* POST http://localhost:3009/api/cards
*/
router.post('/', verify_logged_in, async (req, res)=>{
 try {
  const user_id = req.user.id
  const { company_name, company_description, company_address, company_phone, company_photo } = req.body
   const duplicateCard = await Card.findOne({ company_name: company_name });
    if (duplicateCard) {
      return res.status(409).json({ 
        status: 'fail', 
        message: 'Company already exists' });
    }
  
    const newCard = await Card.create({
      company_name,
      company_description,
      company_address,
      company_phone,
      company_photo,
      user_id
    });

    res.status(200).json({
      status: 'Success',
      data: newCard
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* PUT http://localhost:3009/api/cards/2121212121
*/
router.put('/:id', verify_logged_in, async (req, res)=>{
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id found.' });
    }
    const { company_name, company_description, company_address, company_phone } = req.body
   const duplicateCard = await Card.findOne({ company_name: company_name });
    if (duplicateCard) {
      return res.status(409).json({ 
        status: 'fail', 
        message: 'Company already exists' });
    }

    const oneCard = await Card.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true 
    });
    if (!oneCard) {
      return res.status(404).json({ status: 'Fail', message: 'No id found.' });
    }

    res.status(200).json({
      status: 'Success',
      data: oneCard
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* DELETE http://localhost:3009/api/cards/2121212121212
*/
router.delete('/:id', verify_logged_in, async (req, res)=>{
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id found.' });
    }
    const deleted = await Card.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: 'Failed', message: 'No id found.' });
    }

    res.status(204).json({
      status: 'Card deleted successfully.',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
});



module.exports = router;