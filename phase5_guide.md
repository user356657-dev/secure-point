## Previous Recap
#### Phase 1: Project Setup
- **Project Structure (backend & frontend)**
- **Installing dependencies**
- **Express Server with App Session Setup**
- **Frontend React Vite Setup**
- **Frontend-Backend Setup Verification** *(Working)*

#### Phase 2: Database Setup & Models
- **Setup SQLite DB**
- **Create database tables**
- **Configure DB Helper**
- **Create User Model & Seed Admin User**
- **Database & Model Setup Verification** *(Working)*

#### Phase 3: Secure the Authentication
- **Login/Register APIs- Auth Routes & Controllers**
- **Password hashing using `bcrypt`**
- **Implement account locking mechanism (brute-force protection)**
- **Basic Validations**
- **API testing with Postman** *(Done - Working)*

#### Phase 4: Secure the lifecycle of Session
- **Regenerate the session on each login**
- **Make session cookies secure with flags: `sameSite`, `httpOnly` & `secure`**
- **Implement a User Session Timeout using Middleware**
- **Improve logout feature- delete the auth cookie info.**
- **Features Testing** *(Done - Working)*
****
**<u>*Current Phase - To Do*</u>**
## Phase 5: Hardening the Security
#### 1. Implement CSRF Protection (Critical Step)

**Setup CSRF Middleware**

Inside `app.js`:
```javascript
//At the TOP with all the requires
const csurf = require('csurf');

//AFTER session middleware
app.use(csurf());
```

**Add CSRF Token Route**

Inside `routes/auth.routes.js`:
```javascript
//put this code with all other routes
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```
****
#### 2. Rate Limiting (Login Protection)

Inside `middleware` folder:
- Create a new file named `rateLimit.middleware.js`.
- Then insert the below code in it.
```javascript
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
```
**Apply the rate limit at login route**

Inside `auth.routes.js` under `routes` folder:
```javascript
//At the TOP, add this with all other requires
const { loginLimiter } = require('../middleware/rateLimit.middleware');

//Put this line along with other routes
router.post('/login', loginLimiter, login);
```
****
#### 3. Input Validation (For User Input Data)

**Install a data validation library for ease of use**
- Run the below command in terminal:
```bash
npm install validator
```
Inside `register` function in `auth.controller.js`
- Make some changes in the code as below:
```javascript
//At the TOP, with all other requires
const validator = require('validator');

//Verifying if an input email is a valid email or not
if (!validator.isEmail(email)) {
  return res.status(400).json({ message: 'Invalid email' });
}
```
****
#### 4. Add a global error handler (Important)
Inside `app.js`:
```javascript
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  res.status(500).json({ message: 'Server error' });
});
```
****
#### 5. Test each feature carefully (Very Important)
**a. CSRF Test**

Open postman and send below request "without token":
```http
POST /api/auth/login
```
Expected Output:
```JSON
{
  "message": "Invalid CSRF token"
}
```
Now, first get the token by visiting `/csrf-token` endpoint. Then, send it with the headers this time:
```http
x-csrf-token: token
```
Again hit the login endpoint but now "with token":
```http
POST /api/auth/login
```
Expected Output:
```JSON
{
  "message": "Login successful"
}
```
**b. Rate Limit Test**

Try to login more than 5 times in 1 min.
Expected Output:
```JSON
{
  "message": "Too many login attempts!. Try again later."
}
```

**c. Input Validation Test**

Try putting an invalid email -> ***Should be rejected***
Try putting a weak password -> ***Should be rejected***


<u>*End of Phase 5 - Day 14*</u>


