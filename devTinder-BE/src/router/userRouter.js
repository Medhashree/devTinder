const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();

const USER_DATA_TO_BE_SENT = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "profilePic",
  "skills",
];

//get pending requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA_TO_BE_SENT); // this will only populate the mentioned data from User collection

    if (connectionRequest.length === 0) {
      res.send({ message: "No pending requests" });
    } else {
      res.json({
        message: "Data fetched successfully",
        data: connectionRequest,
      });
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//get all the connections for the loggedIn user
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedUser._id, status: 'accepted'},
                {toUserId: loggedUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', USER_DATA_TO_BE_SENT).populate('toUserId', USER_DATA_TO_BE_SENT);

        if(connectionRequest.length){
            const data = connectionRequest.map((row) => {
                if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId;
            })
            res.json({message: 'Connections', data});
        }else{
            res.send({message: 'No Connections'});
        }
    }catch(err){
        res.status(400).send({message: err.message});
    }
})

module.exports = userRouter;
