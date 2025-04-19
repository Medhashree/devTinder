const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('User is not logged in');
    }
    const decodeObj = await jwt.verify(token, "DEV@Tinder$1706");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!!");
    }

    req.user = user; // finding the user already and sending it to next handler,so that the next handler dosen't have to do a DB search
    next(); // control sent to next handler
  } catch (err) {
    res.status(401).send("ERROR: User is not authenticated: " + err.message);
  }
};

module.exports = { userAuth };
