const express = require('express');
const router = express.Router();
const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessagesByConversation,
  addParticipant,
  removeParticipant,
  listParticipants
} = require('../../controller/chat/chat-controller');

// POST /api/messages
router.post('/message', sendMessage);

// GET /api/messages/:conversationId
router.get('/message/:conversationId', getMessagesByConversation);

// POST /api/conversations
router.post('/conversation', createConversation);

// GET /api/conversations/:userId
router.get('/conversation/:userId', getUserConversations);

// POST /api/participants
router.post('/participant', addParticipant);

// DELETE /api/participants
router.delete('/participant', removeParticipant);

// GET /api/participants/:conversationId
router.get('/participant/:conversationId', listParticipants);

module.exports = router;
