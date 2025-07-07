const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const datapth = path.join(__dirname, 'users.db');
const cors = require('cors');
app.use(cors());
let db = null;
app.use(express.json());

// Return jwt_token

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const SECRET_KEY = "encrypted";
app.use(cookieParser());

// end of jwt_token

const initialiseDatabseAndServer = async () => {
  try {
    db = await open({
      filename: datapth,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log('Server is running at PORT 5000');
    });
  } catch (e) {
    console.log(`ERROR IS ${e.message}`);
    process.exit(1);
  }
};
initialiseDatabseAndServer();

// User registration
app.post('/register', async (request, response) => {
  const { username, email, password } = request.body;
  if (!username || !email || !password) {
    return response.status(400).json({ error_msg: 'Username, Email and password are required' });
  }
  if (password.length < 5) {
    return response.status(400).json({ error_msg: 'Password is too short' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run(`CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);

    const getUserQuery = `SELECT * FROM users WHERE username = ?`;
    const dbUser = await db.get(getUserQuery, [username]);

    if (dbUser) {
      return response.status(400).json({ error_msg: 'User already exists' });
    }

    const createUserQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await db.run(createUserQuery, [username, email, hashedPassword]);

    response.send(true);
  } catch (error) {
    response.status(500).json({ error_msg: 'Email already exists' });
  }
});


//User login after registratoin
app.post('/login', async (request, response) => {
  const { username, password } = request.body
  if (!username || !password) {
    return response.status(400).json({ error_msg: 'Username and password are required' });
  }
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400).json({ error_msg: "Invalid User" })
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const token = jwt.sign({ username: dbUser.username }, SECRET_KEY, { expiresIn: '30d' });
      response.send({ ok: true, jwt_token: token })
    } else {
      response.status(400).json({ error_msg: "Invalid Password" })
    }
  }
})

//Change password of the already existing user
app.put('/change-password', async (request, response) => {
  const { username, oldPassword, newPassword } = request.body
  const selectPreviousUser = `
    SELECT * FROM users WHERE username = '${username}';
  `
  const dbUser = await db.get(selectPreviousUser)
  if (dbUser === undefined) {
    response.status(400)
    response.send.json({ error_msg: 'Invalid user' })
  } else {
    const isPasswordMatched = await bcrypt.compare(oldPassword, dbUser.password)
    if (isPasswordMatched === true) {
      if (newPassword.length < 5) {
        response.status(400)
        response.send('Password is too short')
      } else {
        const hashNewPassword = await bcrypt.hash(request.body.newPassword, 10)
        const updateUserdetails = `
          UPDATE user 
          SET password = '${hashNewPassword}'
        `
        await db.run(updateUserdetails)
        response.send('Password updated')
      }
    } else {
      response.status(400)
      response.send.json({ error_msg: 'Invalid current password' })
    }
  }
})

module.exports = app