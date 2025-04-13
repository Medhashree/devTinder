const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validation");
const user = require("../model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../model/user");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //user passed from userAuth

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Edit restricted for certain fields.");
    }

    let loggedUser = req.user;

    Object.keys(req.body).every((k) => (loggedUser[k] = req.body[k]));
    await loggedUser.save();

    res.json({
      message: `${loggedUser.firstName}, your data is updated successfully`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const loggedUser = req.user;

    const isPasswordValid = await loggedUser.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Password is not strong");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New and confirm passwords should match.");
    }

    const passwordHash = await bcrypt.hash(confirmPassword, 10);
    loggedUser.password = passwordHash;
    loggedUser.save();
    res.send("Password successfully updated!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
