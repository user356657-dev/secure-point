const rateLimit = require('express-rate-limit');

//Limiting the login attempts (per min.) by user
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 min.
  max: 5,  //max attempts
  message: 'Too many login attempts! Try again later.',
});

module.exports = {
  loginLimiter,
};