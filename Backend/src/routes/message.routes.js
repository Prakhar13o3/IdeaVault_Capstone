const express = require('express');
const { auth } = require('../middlewares/authmiddleware');
const { createMessage, getInbox } = require('../controllers/message.controller');

const router = express.Router();

router.post('/', auth, createMessage);
router.get('/inbox', auth, getInbox);

module.exports = router;
