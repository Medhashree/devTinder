const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

const connectDB = require("./config/database");
const User = require("./model/user");
const validateSignUpData = require("./utils/validation");

const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const {userAuth} = require("./middlewares/auth");

app.use(express.json()); // this middleware(runs for all URLs), provided by express to read and convert JSON
app.use(cookies());

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

  //handle your logic within try...catch
  try {
    //validate our req.body
    validateSignUpData(req.body);

    //Encrypt password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the number of saltOperations/encryption

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    }); // req.body returns a JSON, wich is converted to JS obj

    // most of the mongoose methods returns a promise
    await user.save(); // this will save the instance of the model/collection in db

    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Failed to add new user: " + err.message);
  }
});

//Adding login API
app.post('/login', async (req, res) => {
  try{

    const {emailId, password} = req.body;

    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){

      //Create JWT
      const token = await user.getJWT();

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      res.send('Login Successfull!');
    }else{
      throw new Error('Invalid credentials');
    }

  }catch(err){
    res.status(400).send(err.message);
  }
})

app.get('/profile', userAuth, async (req, res) => {
  try{
    const user  = req.user; //user passed from userAuth

    res.send(user);

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

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

    await User.findByIdAndUpdate(userId, data, { runValidators: true });
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
