const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../model/chat");
const ConnectionRequest = require("../model/connectionRequest.js");

const generateSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      // origin: "http://localhost:5173",
      origin: 'http://16.171.234.159/',
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = generateSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ userId, targetUserId, newMsg }) => {
      try {
        const roomId = generateSecretRoomId(userId, targetUserId);

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
        }

        chat.messages.push({
          senderId: userId,
          text: newMsg,
          timestamp: new Date(), // Ensuring timestamp is saved in the proper format
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", {
          sendUserId: userId,
          newMsg,
          time: new Date().toISOString(), // Send timestamp as ISO string
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
