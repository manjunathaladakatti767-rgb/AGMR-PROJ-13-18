/**
 * URL Routes
 * Defines the endpoints for the URL Safety Checker API.
 */
const express = require('express');
const { checkUrl } = require('../controllers/urlController');

const router = express.Router();

// @route   POST /check-url
// @desc    Check safety status of a URL
router.post('/check-url', checkUrl);

module.exports = router;
