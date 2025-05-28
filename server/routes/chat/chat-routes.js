const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getPrivateMessages,
  getGroupMessages,
  createGroup,
  addMember,
  removeMember,
} = require("../../controller/chat/chat-controller");

// Message-related
router.post("/message", sendMessage);
router.get("/messages/private", getPrivateMessages);
router.get("/messages/group/:groupId", getGroupMessages);

// Group-related
router.post("/group", createGroup);
router.post("/group/:groupId/add", addMember);
router.post("/group/:groupId/remove", removeMember);

module.exports = router;
