const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword, message: 'User fetched successfully' });
    } catch (err) {
        console.error('User fetch error:', err);
        return res.status(500).json({ message: 'Something went wrong while trying to fetch user' });
    }
};

module.exports = { getUserById };
