// Import the Express module and create an Express router
const express = require('express');
const router = express.Router(); 

// Import the multer configuration
const multer = require('../Middlewares/multer-config');

// Import the CRUD operations controller for cats
const catCtrl = require('../controllers/cats');

// Define routes with corresponding HTTP methods and control handlers

// Add a new cat
router.post('/', multer, catCtrl.createCat);

// Get all cats
router.get('/', catCtrl.getAllCats);

// Get a cat by ID
router.get('/:id', catCtrl.getOneCat);

// Modify a cat by ID
router.put('/:id', multer, catCtrl.modifyCat);

// Delete a cat by ID
router.delete('/:id', catCtrl.deleteCat);

// Export the router
module.exports = router;