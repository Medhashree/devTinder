const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require('../model/user');

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;

      const fromUserId = loggedUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS = ['ignored', 'interested'];
      if(!ALLOWED_STATUS.includes(status)){
        throw new Error('Invalid status type');
      }

      const toUser = await User.findById(toUserId);
      if(!toUser){
        throw new Error("User not found.");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
      });

      if(existingConnectionRequest){
        throw new Error("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const connectionData = await connectionRequest.save();
      res.json({
        message: "Connection Request send successfully",
        data: connectionData,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = connectionRequestRouter;
