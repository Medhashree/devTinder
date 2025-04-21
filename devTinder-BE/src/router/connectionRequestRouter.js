const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

//Sending Connection req/ ignoring
connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;

      const fromUserId = loggedUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid status type");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found.");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
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

//Receiving connection req, accept/reject
connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
        const loggedUser = req.user;

        const { status, requestId} = req.params;

        const ALLOWED_STATUS = ['accepted', 'rejected'];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Status is incorrect");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedUser._id,
            status: 'interested'
        });

        if(!connectionRequest){
            throw new Error('Connection request not found');
        }

        connectionRequest.status = status;

        await connectionRequest.save();

        res.json({message: "Connection request " +status, data: connectionRequest});

    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

//Receiving profile of people sending connection request
connectionRequestRouter.get(
  "/request/profile/:userId",
  userAuth,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
    if(!user){
      throw new Error('User dose not exists');
    }
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

//get all the connections of the profile viewed
connectionRequestRouter.get("/request/profile/connections/:userId", userAuth, async (req, res) => {
  try {

    const {userId} = req.params;
    const loggedUser = await User.findById(userId);

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA_TO_BE_SENT)
      .populate("toUserId", USER_DATA_TO_BE_SENT);

    if (connectionRequest.length) {
      const data = connectionRequest.map((row) => {
        if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });
      res.json({ message: "Connections", data });
    } else {
      res.send({ message: "No Connections" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = connectionRequestRouter;
