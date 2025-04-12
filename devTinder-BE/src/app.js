const express = require("express");

const app = express();

const connectDB = require("./config/database");
const User = require("./model/user");

app.use(express.json()); // this middleware(runs for all URLs), provided by express to read and convert JSON

//Adding user after sign-up
app.post("/signup", async (req, res) => {
  // const user = new User({
  //   firstName: "Medhashree",
  //   lastName: "Moshat",
  //   emailId: "medhashree.moshat@gmail.com",
  //   password: "medha123",
  //   age: 26,
  //   gender: "Female",
  // });

  const user = new User(req.body); // req.body returns a JSON, wich is converted to JS obj

  //handle your logic within try...catch
  try {
    // most of the mongoose methods returns a promise
    await user.save(); // this will save the instance of the model/collection in db

    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Failed to add new user: " + err.message);
  }
});

//Get user by emailId
app.get("/users", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Feed - get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // passing empty object to find all the users

    if (!users) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Update user by emailId
app.patch("/updateUser", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const data = req.body;

    await User.findOneAndUpdate({ emailId: userEmail }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed: " + err.message);
  }
});

//update user by userId
app.patch("/userUpdate/:userId", async (req, res) => {
  try {
    const ALLOW_UPDATES = [
      "lastname",
      "password",
      "age",
      "gender",
      "about",
      "profilePic",
      "skills",
    ];
    const userId = req.params?.userId;
    const data = req.body;

    //API Validation
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOW_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updating certain fields are restricted.");
    }

    await User.findByIdAndUpdate(userId , data, { runValidators: true });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed: " + err.message);
  }
});

//delete user by id
app.delete("/deleteUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId); // also can be written as findByIdAndDelete({_id: userId})
    res.send("User deleted successfully");
  } catch {
    res.status(400).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully"); // first DB should be connected and then it should  listen to server
    //Listen to given port
    app.listen("7777", () =>
      console.log("Server is successfully listening on port 7777...")
    );
  })
  .catch((err) => {
    console.error("Database not connected", err);
  });
