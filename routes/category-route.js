const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const categoryById = require('../middlewares/categoryById');
const { check, validationResult } = require('express-validator');

// @ROUTE POST api/category
// @DESC Create Category
// @ACCESS Private Admin
router.post('/', [
  // Validating Category name
  check('name is required').trim().not().isEmpty()
], auth, adminAuth, async (req, res) => {
  
  // If Errors from Validating
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ error: errors.array()[0].msg })
  }
  // Parsing name from req.body
  const { name } = req.body;

  try {
    let category = await Category.findOne({ name });

    // If category exists
    if(category){
      res.status(403).json({ error: 'Category already exists'})
    }
    const newCategory = new Category({name});
    // Saving new category
    category = await newCategory.save();
    console.log(category);
    return res.json(category);
    
  } catch (error) {
    console.log(console.error);
    res.status(500).send('Server Error');
  }
})

// @ROUTE GET api/category
// @DESC Get all Categories
// @ACCESS Private Admin
router.get('/all', async (req, res) => {
  try {
    let data = await Category.find({});
    res.json(data)
    console.log(data);

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
})

module.exports = router;