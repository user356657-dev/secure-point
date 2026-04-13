const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');

const {
  getAllUsers,
  deleteUser,
} = require('../controllers/admin.controller');

router.get(
  '/users',
  authMiddleware,
  allowRoles('admin'),
  getAllUsers
);

router.delete(
  '/users/:id',
  authMiddleware,
  allowRoles('admin'),
  deleteUser
);

module.exports = router;
