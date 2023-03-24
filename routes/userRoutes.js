const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../models/userModel');
const verify_logged_in = require('../middleware/verify_logged_in')
const sendEmail = require('./../utils/mail');
const validator = require('validator');

// Token signing function
const signToken = (id, biz) => {
  return jwt.sign({ id, biz }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

const cookieOptions = {
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 
  httpOnly: true
};


/*
* POST http://localhost:3009/api/users/register
*/
router.post('/register', async (req, res)=>{
  try {
    const { name, email, password, confirmPassword } = req.body;
    const duplicateEmail = await User.findOne({ email: email });
    if (duplicateEmail) {
      return res.status(409).json({ status: 'Fail', message: 'Email already exist' });
    }
    const newUser = await User.create(req.body);
    const { _id } = newUser;

    await sendEmail({
      email: newUser.email,
      subject: 'Thank you for registering.',
      message: 'Here is a special discount code to help get started!'
    });

    res.status(200).json({
      status: 'Success',
      data: { name, email, _id },
      message: 'User has been registered successfully.'
    });
  } catch (err) {
    res.status(401).json({
      status: 'Fail',
      message: err.message
    });
  }
})

/*
* POST http://localhost:3009/api/users/login
*/
router.post('/login', async (req, res)=>{
 try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'No email or password found.' });
    }
    const user = await User.findOne({ email }).select('+password'); 
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ status: 'Email or password invalid.' });
    }
    const token = signToken(user._id, user.biz);
    
    if (!token) {
      return res.status(401).json({ status: 'There was problem with your authentication, please sign in again.'});
    }

    res.cookie('jwt', token, cookieOptions);
    
    res.status(200).json({
      status: 'Success',
      token: token 
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* GET http://localhost:3009/api/users/myUser
*/
router.get('/myUser', verify_logged_in, async (req, res)=>{
 try {
    const decoded = req.user;
    const currentUser = await User.findById(decoded.id);
    res.status(200).json({ status: 'Success', 'user details': currentUser });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* PATCH http://localhost:3009/api/users/updateMyUser
*/
router.patch('/updateMyUser', verify_logged_in, async (req, res)=>{
 try {
    const { name, email, biz } = req.body;

    const duplicateEmail = await User.findOne({ email: email });
    if (duplicateEmail) {
      return res.status(409).json({ status: 'fail', message: 'Email already exists.' });
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name:name, email:email, biz: biz }, 
      { new: true, runValidators: true }
      );

    res.status(200).json({ status: 'Success', data: updatedUser });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
});

/*
* PATCH http://localhost:3009/api/users/resetPassword
*/
router.patch('/resetPassword', verify_logged_in, async (req, res)=>{
 try {
    let { password } = req.body;

    let duplicatePass = await User.findOne({ password: password });
    if (duplicatePass) {
      return res.status(409).json({ status: 'fail', message: 'Cannot use the same password.' });
    }

    password = await bcrypt.hash(password, 12); 

    let updatedPass = await User.findByIdAndUpdate(req.user.id,{ password: password });

    res.status(200).json({ status: 'Success', data: updatedPass });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message
    });
  }
});


/*
* GET http://localhost:3009/api/users/logout
*/
// router.get('/logout', verify_logged_in, async (req, res)=>{
//    try {
    
//   } catch (err) {
//     res.status(400).json({
//       status: 'Fail',
//       message: err.message
//     });
//   }
// })

module.exports = router;




