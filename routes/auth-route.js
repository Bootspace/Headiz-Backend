const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const secretKey = process.env.JWTSECRETKEY
const json = require('body-parser/lib/types/json');

//  @route GET api/user
//  @desc User information
//  @access private
router.get('/', auth, async (req, res) => {
  try{
    // Get User information by ID
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  }
  catch(error) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})

//  @route POST api/user/register
//  @desc Register User
//  @access Public
router.post
  ('/register',
  [
    // Validation
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid Email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6}),
  ],

  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Get email name and password from the request body
    const { name, email, password } = req.body;

    try {
      // Check if User already exists
      let user = await User.findOne({ email });

      // Now if User already exists
      if(user) {
        return res.status(400).json({
          errors: [{
          msg: "User already exists"
        }, ],
        });
      }

      // Create user object
      user = new User({ name, email, password });

      // Encrpyt the Password
      const salt = await bcrypt.genSalt(10) //Generating new salt for hashing password

      // Saving hashed password
      user.password = await bcrypt.hash(password, salt); //Use user password and salt to hash password
      
      // saving user in database
      await user.save();

      // Payload to generate Token
      const payLoad = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payLoad, secretKey, {
        expiresIn: 3600},
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
       );    
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).send('Server error')
    }
  }
);

// @ROUTE POST api/user/login
// @DESC Login User
// @ACCESS Public
router.post('/login', [
  // Validating the Email and password
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'password is required').exists()
  ],
  async(req, res) => {
    // if errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    // If everything cool and nice
    // Get email and password from req.body
    const { email, password } = req.body;

    try {
      // Finding User
      let user = await User.findOne({ email });

      // If user not found in Database
      if(!user){
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] })
      }

      //Now user has been found in the database
      // Lets compare password
      const isMatch = await bcrypt.compare(password, user.password);

      // Passwords dont match?
      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] })
      }

      // If passwords match
      // Create JWT token for user
      const payLoad = {
        user: { id: user.id, },
      };

      jwt.sign(payLoad, secretKey, {
        expiresIn: 3600},
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
       );    
      
    } catch (error) {
      console.log(err.message);
      res.status(500).send('Server error')
    }
  })

  module.exports = router;
