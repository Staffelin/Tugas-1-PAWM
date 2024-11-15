const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: '8c79aa501a749f83064b3b87440d155a00b16902dae1710563f55eed91128c85ce81975ffe463278ae42ae5f9c65fdd00f4ff0b19c84ddc21a99ca18e9e51edc', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static('Login')); // Folder for HTML, CSS, and JS files

// Render the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/Login Page.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await prisma.user.findUnique({
    where: { PhysiksWorks: username },
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    // Passwords match, create session
    req.session.userId = user.id;
    res.send('Login successful! <a href="/protected">Go to protected page</a>');
  } else {
    res.send('Invalid username or password. <a href="/login">Try again</a>');
  }
});

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.send('You must be logged in to view this page. <a href="/login">Login</a>');
  }
}

// Protected route
app.get('/protected', requireAuth, (req, res) => {
  res.send('Welcome to the protected page!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
