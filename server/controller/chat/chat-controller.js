const db = require('../../lib/dbconnect-mysql');

const sendMessage = (req, res) => {
  const { senderId, receiverId, text, image, conversationId } = req.body;

  if (!senderId || (!conversationId && !receiverId) || (!text && !image)) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  const proceedWithMessage = (convId) => {
    const sql = `
      INSERT INTO ChatMessages (senderId, text, image, conversationId)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [senderId, text || null, image || null, convId], (err, result) => {
      if (err) {
        console.error('❌ Error sending message:', err);
        return res.status(500).json({ message: 'Error sending message' });
      }

      res.status(201).json({ message: 'Message sent', conversationId: convId });
    });
  };

  if (conversationId) {
    proceedWithMessage(conversationId);
  } else {
    findOrCreateOneToOneConversation(senderId, receiverId, (err, convId) => {
      if (err) {
        console.error('❌ Error handling conversation:', err);
        return res.status(500).json({ message: 'Error handling conversation' });
      }

      proceedWithMessage(convId);
    });
  }
};

// Get all messages in a conversation
const getMessagesByConversation = (req, res) => {
  const { conversationId } = req.params;
    console.log(conversationId);
  const sql = `
    SELECT cm.id, cm.senderId, cm.text, cm.image, cm.createdAt
    FROM ChatMessages cm
    JOIN attendance_logs p ON cm.senderId = p.id
    WHERE cm.conversationId = ?
    ORDER BY cm.createdAt ASC
  `;

  db.query(sql, [conversationId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching messages:', err);
      return res.status(500).json({ message: 'Error fetching messages' });
    }

    res.json(results);
  });
};

// Create a new conversation
const createConversation = (req, res) => {
  const { isGroup, name, participants } = req.body;

  if (isGroup && (!name || !participants || participants.length < 2)) {
    return res.status(400).json({ message: 'Group name and at least 2 participants are required.' });
  }

  const sql = `INSERT INTO Conversations (isGroup, name) VALUES (?, ?)`;
  db.query(sql, [isGroup, name || null], (err, result) => {
    if (err) {
      console.error('❌ Error creating conversation:', err);
      return res.status(500).json({ message: 'Internal error creating conversation' });
    }

    const conversationId = result.insertId;

    // Insert participants
    const values = participants.map(userId => [conversationId, userId]);
    const insertParticipants = `INSERT INTO ConversationParticipants (conversationId, userId) VALUES ?`;

    db.query(insertParticipants, [values], (err) => {
      if (err) {
        console.error('❌ Error adding participants:', err);
        return res.status(500).json({ message: 'Error adding participants' });
      }

      res.status(201).json({ message: 'Conversation created', conversationId });
    });
  });
};

// Get all conversations for a user
const getUserConversations = (req, res) => {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  const sql = `
    SELECT c.id, c.name, c.isGroup, c.createdAt
    FROM Conversations c
    JOIN ConversationParticipants cp ON cp.conversationId = c.id
    WHERE cp.userId = ?
    ORDER BY c.createdAt DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching conversations:', err);
      return res.status(500).json({ message: 'Error fetching conversations' });
    }

    res.json(results);
  });
};

const addParticipant = (req, res) => {
  const { conversationId, userId } = req.body;

  if (!conversationId || !userId) {
    return res.status(400).json({ message: 'conversationId and userId required' });
  }

  const sql = `
    INSERT INTO ConversationParticipants (conversationId, userId)
    VALUES (?, ?)
  `;

  db.query(sql, [conversationId, userId], (err) => {
    if (err) {
      console.error('❌ Error adding participant:', err);
      return res.status(500).json({ message: 'Error adding participant' });
    }

    res.status(201).json({ message: 'Participant added' });
  });
};

// Remove participant
const removeParticipant = (req, res) => {
  const { conversationId, userId } = req.body;

  const sql = `
    DELETE FROM ConversationParticipants
    WHERE conversationId = ? AND userId = ?
  `;

  db.query(sql, [conversationId, userId], (err, result) => {
    if (err) {
      console.error('❌ Error removing participant:', err);
      return res.status(500).json({ message: 'Error removing participant' });
    }

    res.json({ message: 'Participant removed', affectedRows: result.affectedRows });
  });
};

// List participants
const listParticipants = (req, res) => {
  const { conversationId } = req.params;

  const sql = `
    SELECT p.id, p.name
    FROM ConversationParticipants cp
    JOIN attendance_logs p ON cp.userId = p.id
    WHERE cp.conversationId = ?
  `;

  db.query(sql, [conversationId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching participants:', err);
      return res.status(500).json({ message: 'Error fetching participants' });
    }

    res.json(results);
  });
};

const findOrCreateOneToOneConversation = (senderId, receiverId, callback) => {
  const checkSql = `
    SELECT c.id
    FROM Conversations c
    JOIN ConversationParticipants cp1 ON c.id = cp1.conversationId AND cp1.userId = ?
    JOIN ConversationParticipants cp2 ON c.id = cp2.conversationId AND cp2.userId = ?
    WHERE c.isGroup = FALSE
    LIMIT 1
  `;

  db.query(checkSql, [senderId, receiverId], (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      return callback(null, results[0].id); // existing conversationId
    }

    // No conversation found — create one
    const createConversationSql = `INSERT INTO Conversations (isGroup) VALUES (FALSE)`;
    db.query(createConversationSql, (err, result) => {
      if (err) return callback(err);

      const conversationId = result.insertId;

      // Add both users as participants
      const participantSql = `
        INSERT INTO ConversationParticipants (conversationId, userId)
        VALUES (?, ?), (?, ?)
      `;
      db.query(participantSql, [conversationId, senderId, conversationId, receiverId], (err) => {
        if (err) return callback(err);
        return callback(null, conversationId);
      });
    });
  });
};

module.exports = {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessagesByConversation,
  addParticipant,
  removeParticipant,
  listParticipants
};
