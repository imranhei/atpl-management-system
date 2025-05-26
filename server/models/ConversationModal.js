const db = require("../lib/dbconnect-mysql");

// Create Conversations table
const createConversationsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS Conversations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      isGroup BOOLEAN NOT NULL DEFAULT FALSE,
      name VARCHAR(255) DEFAULT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Failed to create Conversations table:", err);
    } else {
      console.log("Conversations table checked/created (if not existed).");
    }
  });
};

// Create ConversationParticipants table
const createConversationParticipantsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ConversationParticipants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      conversationId INT NOT NULL,
      userId INT NOT NULL,
      joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversationId) REFERENCES Conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES attendance_logs(id) ON DELETE CASCADE
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Failed to create ConversationParticipants table:", err);
    } else {
      console.log(
        "ConversationParticipants table checked/created (if not existed)."
      );
    }
  });
};

// Create ChatMessages table
const createChatMessagesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ChatMessages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      senderId INT NOT NULL,
      text TEXT,
      image VARCHAR(255),
      conversationId INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senderId) REFERENCES attendance_logs(id) ON DELETE CASCADE,
      FOREIGN KEY (conversationId) REFERENCES Conversations(id) ON DELETE CASCADE
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Failed to create ChatMessages table:", err);
    } else {
      console.log("ChatMessages table checked/created (if not existed).");
    }
  });
};

const createConversationTables = () => {
  createConversationsTable();
  createConversationParticipantsTable();
  createChatMessagesTable();
};

module.exports = { createConversationTables };
