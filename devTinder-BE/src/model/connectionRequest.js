const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' //fromUserId is now referring to the User Collection, we can populate user data from fromUserId
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      required: true,
      eNum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}) // compound indexes

connectionRequestSchema.pre('save', function(next) { // this function now will be called everytime before save, before we save anything to db, that's why the name pre
    const connectionRequest = this;

    if(connectionRequest.fromUserId === connectionRequest.toUserId){
        throw new Error("Cannot send connection request to yourself");
    }

    next();
});

module.exports = new mongoose.model("ConnectionRequest", connectionRequestSchema);
