const db = require("../../lib/dbconnect-mysql");
const { getReceiverSocketId, io } = require("../../lib/socket");
const cloudinary = require("../../lib/cloudinary");

// Send message (1-to-1 or group)
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, groupId, message, image_url } = req.body;

  const sql = `
    INSERT INTO chat_messages (sender_id, receiver_id, group_id, message, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  let imageUrl = null;
  if (image_url) {
    const uploadResponse = await cloudinary.uploader.upload(image_url, {
      folder: "chat-app", // cloudinary folder path
      // transformation: [
      //   { width: 800, crop: "limit" }, // Resize if too large
      //   { quality: "auto" }, // Automatic compression
      // ],
    });
    imageUrl = uploadResponse.secure_url;
    console.log("Image uploaded to Cloudinary:", imageUrl);
  }

  db.query(
    sql,
    [senderId, receiverId || null, groupId || null, message, imageUrl],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to send message", details: err });
      }
      const newMessage = {
        id: result.insertId,
        senderId,
        receiverId,
        groupId,
        message,
        image_url: imageUrl || null,
        sent_at: new Date().toISOString(),
      };

      if (receiverId) {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      }

      res
        .status(201)
        .json({ message: "Message sent", messageId: result.insertId });
    }
  );
};

// Get private messages between two users
exports.getPrivateMessages = (req, res) => {
  const { user1, user2 } = req.query;

  const sql = `
    SELECT * FROM chat_messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY sent_at ASC
  `;

  db.query(sql, [user1, user2, user2, user1], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch messages", details: err });
    }
    res.json(results);
  });
};

// Get messages for a group
exports.getGroupMessages = (req, res) => {
  const groupId = req.params.groupId;

  const sql = `
    SELECT cm.*, u.name AS sender_name
    FROM chat_messages cm
    JOIN users u ON cm.sender_id = u.id
    WHERE cm.group_id = ?
    ORDER BY cm.sent_at ASC
  `;

  db.query(sql, [groupId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch group messages", details: err });
    }
    res.json(results);
  });
};

// Create new group
exports.createGroup = (req, res) => {
  const { name, createdBy } = req.body;

  const sql = `
    INSERT INTO chat_groups (name, created_by)
    VALUES (?, ?)
  `;

  db.query(sql, [name, createdBy], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to create group", details: err });
    }
    res
      .status(201)
      .json({ message: "Group created", groupId: result.insertId });
  });
};

// Add member to group
exports.addMember = (req, res) => {
  const groupId = req.params.groupId;
  const { userId } = req.body;

  const sql = `
    INSERT IGNORE INTO chat_group_members (group_id, user_id)
    VALUES (?, ?)
  `;

  db.query(sql, [groupId, userId], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to add member", details: err });
    }
    res.json({ message: "Member added to group" });
  });
};

// Remove member from group
exports.removeMember = (req, res) => {
  const groupId = req.params.groupId;
  const { userId } = req.body;

  const sql = `
    DELETE FROM chat_group_members
    WHERE group_id = ? AND user_id = ?
  `;

  db.query(sql, [groupId, userId], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to remove member", details: err });
    }
    res.json({ message: "Member removed from group" });
  });
};
