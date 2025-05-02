const express = require("express");
const Chat = require("../model/chat");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest.js");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;

    const userId = req.user._id;

    //user can only chat if they are connected
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    });
    if (connectionRequest.length === 0) {
      return res
        .status(400)
        .send({ message: "ERROR: Only connected users can chat." });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json({ data: chat });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = chatRouter;
