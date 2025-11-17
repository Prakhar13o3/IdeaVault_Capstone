const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
}

const getRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '30d' });
}

const signup = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        const userName = username || name; // Accept both username and name

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exist = await prisma.user.findUnique({ where: { email } });

        if (exist) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: userName,
                email,
                password: hashedPassword,
                projectIds: []
            }
        });

        const accessToken = getAccessToken(user);
        const refreshToken = getRefreshToken(user);

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            user: userWithoutPassword,
            accessToken,
            refreshToken,
            message: 'Signup successful'
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ 
            message: err.message || 'Something went wrong while trying to signup',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = getAccessToken(user);
        const refreshToken = getRefreshToken(user);

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            user: userWithoutPassword,
            accessToken,
            refreshToken,
            message: 'Login successful'
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Something went wrong while trying to login' });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = getAccessToken(user);
        const newRefreshToken = getRefreshToken(user);

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken,
            message: 'Token refreshed successfully'
        });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        console.error('Refresh token error:', err);
        return res.status(500).json({ message: 'Something went wrong while trying to refresh token' });
    }
}

module.exports = { signup, login, refreshToken };
