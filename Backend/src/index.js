const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api', (req, res) => {
  res.status(200).send('Welcome to IdeaVault Backend API');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



