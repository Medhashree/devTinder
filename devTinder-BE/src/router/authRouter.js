const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../model/user");

//Adding user after sign-up
authRouter.post("/signup", async (req, res) => {
  // const user = new User({
  //   firstName: "Medhashree",
  //   lastName: "Moshat",
  //   emailId: "medhashree.moshat@gmail.com",
  //   password: "medha123",
  //   age: 26,
  //   gender: "Female",
  // });

  //handle your logic within try...catch
  try {
    //validate our req.body
    validateSignUpData(req.body);

    //Encrypt password
    const { firstName, lastName, emailId, password, age, gender, about, profilePic, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the number of saltOperations/encryption

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      profilePic,
      skills
    }); // req.body returns a JSON, wich is converted to JS obj

    // most of the mongoose methods returns a promise
    await user.save(); // this will save the instance of the model/collection in db

    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Failed to add new user: " + err.message);
  }
});

//Adding login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create JWT
      const token = await user.getJWT();

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Successfully logged out!");
});

module.exports = authRouter;
