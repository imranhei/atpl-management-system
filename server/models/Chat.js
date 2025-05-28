const db = require("../lib/dbconnect-mysql");

const createChatMessagesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS chat_messages (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT,
        group_id INT,
        message TEXT,
        image_url VARCHAR(500),
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES attendance_logs(id),
        FOREIGN KEY (receiver_id) REFERENCES attendance_logs(id),
        FOREIGN KEY (group_id) REFERENCES chat_groups(id)
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

const createChatGroupTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS chat_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_by INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES attendance_logs(id)
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

const createChatGroupMembersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS chat_group_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES attendance_logs(id) ON DELETE CASCADE,
        UNIQUE KEY (group_id, user_id)
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

const createChatTables = () => {
  createChatMessagesTable();
  createChatGroupTable();
  createChatGroupMembersTable();
};

module.exports = { createChatTables };
