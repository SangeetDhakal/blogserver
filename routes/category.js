const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/category', categoryCreateValidator, runValidation, requireSignin,adminMiddleware, create); //removed adminMiddleware
router.get('/categories', list);
router.post('/category/:slug', read);
router.delete('/category/:slug', requireSignin, remove); //removed adminMiddleware

module.exports = router;
