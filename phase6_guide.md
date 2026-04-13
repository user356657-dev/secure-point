This phase directly maps to our source requirements :

* role-based access control
* admin-only user management
* permission-based route protection

---

# 🔐 Phase 6 — RBAC (Role-Based Access Control)

**Day 16–18**

## 🎯 Goal

* Protect routes based on roles
* Separate `admin` vs `user`
* Create admin-only APIs
* Prepare frontend route guards later

---

# 🧠 Access Model

Let’s keep it simple and scalable:

## Roles

```text
admin
user
```

---

## Access Matrix

| Route        | User | Admin |
| ------------ | ---: | ----: |
| login/logout |    ✅ |     ✅ |
| profile      |    ✅ |     ✅ |
| list users   |    ❌ |     ✅ |
| create user  |    ❌ |     ✅ |
| delete user  |    ❌ |     ✅ |
| view logs    |    ❌ |     ✅ |

This is perfect for your 30–35 day sprint.

---

# 1️⃣ Create Role Middleware

📁 `backend/src/middleware/role.middleware.js`

```js id="x1d9a4"
function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
}

module.exports = allowRoles;
```

---

# 💡 Why This Design Is Good

This lets you do:

```js id="7n0u2m"
allowRoles('admin')
```

or later:

```js id="p4m6r1"
allowRoles('admin', 'manager')
```

Very scalable.

---

# 2️⃣ Create Admin Routes

📁 `backend/src/routes/admin.routes.js`

```js id="2h5v7k"
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
```

---

# 3️⃣ Create Admin Controller

📁 `backend/src/controllers/admin.controller.js`

```js id="k8u2w6"
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
```

---

# 4️⃣ Register Routes

📁 `app.js`

```js id="q5m3t8"
const adminRoutes = require('./routes/admin.routes');

app.use('/api/admin', adminRoutes);
```

---

# 5️⃣ Test RBAC (VERY IMPORTANT)

---

## 🔹 Test as normal user

Login as:

```json id="k1q5r3"
{
  "email": "user1@test.com",
  "password": "User@123"
}
```

Call:

```http id="w4e6u2"
GET /api/admin/users
```

---

### ✅ Expected

```json id="t7y9z1"
{
  "message": "Forbidden: insufficient permissions"
}
```

Status:

```text
403
```

Perfect.

---

---

## 🔹 Test as admin

Login as:

```json id="m3c7b5"
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Call:

```http id="f8j2n6"
GET /api/admin/users
```

---

### ✅ Expected

```json id="r2v4p9"
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

---

# 🔒 Security Note (Important)

You are using:

```js id="d5h8k1"
req.session.user.role
```

This is good because:

* role comes from server session
* cannot be modified by frontend
* stronger than localStorage/JWT payload trust

Excellent security design.

---

# 🚀 Optional Small Improvement (Recommended)

Prevent admin deleting themselves:

Update `deleteUser()`:

```js id="n6u4c8"
if (Number(id) === req.session.user.id) {
  return res.status(400).json({
    message: 'Admin cannot delete own account',
  });
}
```

Very professional touch.

---

# ✅ Phase 6 Outcome

You now have:

✅ RBAC
✅ Admin-only APIs
✅ Role middleware
✅ Permission-based route protection

👉 This is now a **proper secure user management portal**

---
