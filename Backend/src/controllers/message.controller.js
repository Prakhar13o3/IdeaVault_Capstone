const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createMessage = async (req, res) => {
  try {
    const fromUserId = req.userId;
    const { toUserId, projectId, content } = req.body;

    if (!toUserId || !content) {
      return res.status(400).json({ message: 'toUserId and content are required' });
    }

    const message = await prisma.message.create({
      data: { fromUserId, toUserId, projectId, content }
    });

    // attach sender username to response
    const sender = await prisma.user.findUnique({ where: { id: fromUserId } });
    const resp = { ...message, fromUsername: sender ? sender.username : 'Unknown' };

    res.status(201).json({ message: resp, messageText: 'Message sent' });
  } catch (err) {
    console.error('Create message error:', err);
    return res.status(500).json({ message: 'Something went wrong while trying to send message' });
  }
};

const getInbox = async (req, res) => {
  try {
    const userId = req.userId;
    const messages = await prisma.message.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: 'desc' }
    });

    // attach sender username and project title if available
    const enriched = await Promise.all(messages.map(async (m) => {
      const sender = await prisma.user.findUnique({ where: { id: m.fromUserId } });
      const project = m.projectId ? await prisma.project.findUnique({ where: { id: m.projectId } }) : null;
      return { ...m, fromUsername: sender ? sender.username : 'Unknown', projectTitle: project ? project.title : null };
    }));

    res.status(200).json({ messages: enriched });
  } catch (err) {
    console.error('Get inbox error:', err);
    return res.status(500).json({ message: 'Something went wrong while trying to fetch messages' });
  }
};

module.exports = { createMessage, getInbox };
