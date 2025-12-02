const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Create a new message from authenticated user to another user
 * POST /api/messages
 * Body: { toUserId, projectId?, content }
 */
const createMessage = async (req, res) => {
  try {
    const fromUserId = req.userId; // from auth middleware
    const { toUserId, projectId, content } = req.body;

    // Validate required fields
    if (!fromUserId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    if (!toUserId || !content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: 'toUserId and non-empty content are required' });
    }

    // Prevent user from messaging themselves
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }
    console.log('---------->>>>>>>>>>>>:', fromUserId, toUserId, projectId, content);
    console.log("------",prisma.message)
    console.log("------",prisma.Message)
      // Create the message
      const message = await prisma.message.create({
        data: {
          fromUserId,
          toUserId,
          projectId: projectId || null,
          content: content.trim()
        }
      });

    // Fetch sender info to include in response
    const sender = await prisma.user.findUnique({ where: { id: fromUserId } });

    const response = {
      ...message,
      fromUsername: sender?.username || 'Unknown'
    };

    res.status(201).json({
      message: response,
      messageText: 'Message sent successfully'
    });
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({
      message: 'Failed to send message',
      error: err.message, // TEMPORARY: Exposing error for debugging
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

/**
 * Fetch all messages for authenticated user (inbox)
 * GET /api/messages/inbox
 */
const getInbox = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    // Fetch all messages addressed to the user
    const messages = await prisma.message.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: 'desc' }
    });

    // Enrich with sender username and project title
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await prisma.user.findUnique({
          where: { id: msg.fromUserId }
        });

        let projectTitle = null;
        if (msg.projectId) {
          const project = await prisma.project.findUnique({
            where: { id: msg.projectId }
          });
          projectTitle = project?.title || null;
        }

        return {
          ...msg,
          fromUsername: sender?.username || 'Unknown',
          projectTitle
        };
      })
    );

    res.status(200).json({
      messages: enrichedMessages,
      count: enrichedMessages.length
    });
  } catch (err) {
    console.error('Get inbox error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({
      message: 'Failed to fetch inbox',
      error: err.message, // Exposed for debugging
      stack: err.stack    // Exposed for debugging
    });
  }
};

module.exports = { createMessage, getInbox };
