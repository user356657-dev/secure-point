const express = require('express');
const { loginLimiter } = require('../middleware/rateLimit.middleware');
const router = express.Router();

const {
    register,
    login, 
    logout,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;  