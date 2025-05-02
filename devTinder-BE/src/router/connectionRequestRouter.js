const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest.js");
const User = require("../model/user");
const nodemailer = require("nodemailer");

const USER_DATA_TO_BE_SENT = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "profilePic",
  "skills",
];

// Configure transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CONNECTION_REQUEST_EMAILID,
    pass: process.env.CONNECTION_REQUEST_PASSWORD,
  },
});

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

      // ✅ Send email if status is 'interested'
      if (status === "interested") {
        const mailOptions = {
          from: process.env.CONNECTION_REQUEST_EMAILID,
          to: toUser.emailId,
          subject: "🔥 Someone's Interested in You on DevTinder!",
          html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border-radius: 10px;">
      <h2 style="color: #d72638;"> Hello ${toUser.firstName},</h2>
      <p style="font-size: 16px; line-height: 1.6;">
        <strong>${loggedUser.firstName}</strong> just showed interest in connecting with you on <strong>DevTinder</strong>!
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Curious to know more? Don’t keep them waiting!
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://16.171.234.159/" target="_blank" style="background-color: #ff4757; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
           Log in to View Request
        </a>
      </div>
      <p style="font-size: 14px; color: #888;">— The DevTinder Team</p>
    </div>
  `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error("Email error:", error);
          }
        });
      }

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

      const { status, requestId } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Status is incorrect");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }

      connectionRequest.status = status;

      await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data: connectionRequest,
      });
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
      if (!user) {
        throw new Error("User dose not exists");
      }
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

//get all the connections of the profile viewed
connectionRequestRouter.get(
  "/request/profile/connections/:userId",
  userAuth,
  async (req, res) => {
    try {
      const { userId } = req.params;
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
        res.json({ message: "Connections", data: data });
      } else {
        res.send({ message: "No Connections", data: [] });
      }
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

//block connections WIP
// connectionRequestRouter.post(
//   "/block/rejected/:requestId",
//   userAuth,
//   async (req, res) => {
//     try {
//         const loggedUser = req.user;

//         const { requestId }  = req.params;

//         const connectionRequest = await ConnectionRequest.findOne({
//             _id: requestId,
//             toUserId: loggedUser._id,
//             status: 'accepted'
//         });

//         if(!connectionRequest){
//             throw new Error('Connection request not found');
//         }

//         connectionRequest.status = 'rejected';

//         await connectionRequest.save();

//         res.json({message: `${loggedUser.firstName} was blocked`, data: connectionRequest});

//     } catch (err) {
//       res.status(400).send("ERROR: " + err.message);
//     }
//   }
// );

module.exports = connectionRequestRouter;
