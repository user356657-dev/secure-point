const db = require('../config/db.helper');

function getAllUsers(req, res) {
  try {
    const users = db.all(`
      SELECT id, email, role, is_active, created_at
      FROM users
    `);

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch users',
    });
  }
}

function deleteUser(req, res) {
  try {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      message: 'User deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Delete failed',
    });
  }
}

module.exports = {
  getAllUsers,
  deleteUser,
};