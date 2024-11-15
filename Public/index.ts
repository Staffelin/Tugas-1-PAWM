import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
}));

// Endpoint Register
app.post('/register', async (req, res) => {
    const { userId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await prisma.userState.create({
            data: { userId, progress: null, results: null },
        });
        res.redirect('/login');
    } catch {
        res.status(400).send('User ID already exists');
    }
});

// Endpoint Login
app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    const user = await prisma.userState.findUnique({
        where: { userId },
    });

    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.results || ''); // Simulasi password check
        if (isValidPassword) {
            req.session.userId = user.userId;
            res.redirect('/homepage');
        } else {
            res.status(401).send('Invalid password');
        }
    } else {
        res.status(401).send('User not found');
    }
});

// Middleware untuk proteksi halaman
const requireLogin: express.RequestHandler = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Halaman utama
app.get('/homepage', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
