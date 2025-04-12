const express = require("express");

const app = express();

//Request Handler
// app.use((req, res) => {
//     res.send('Hello from the Server!');
// })

//Order of the routes matters

// app.use('/',(req, res) => {
//     res.send('Hi Medha!'); // if this is present at the top then, it will handle everything that comes with '/' like '//' or '/test' also
// })

app.use("/test", (req, res) => {
  res.send("Hi from the Server!"); // same for this, this can also handle '/test/hello' but not '/test123' though
});

//app.use will handle all types of HTTP methods, so we use get/post specifically

app.get("/users", (req, res) => {
  res.send({ firstName: "Medhashree", lastName: "Moshat" }); // this will only use GET HTTP method. Will always get the data we have send
});

//Advance Routing Concepts
app.get("/abcd", (req, res) => {
  // this will work for /abcd
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

app.get("/ab?cd", (req, res) => {
  // this will make b optional, will work for '/abcd' , also for '/acd'
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

app.get("/ab+cd", (req, res) => {
  // this will make sure you have 1 a and 1 cd and in between you can add as many b you want, '/abcd' , '/abbbbbbbcd
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

app.get("/ab*cd", (req, res) => {
  // this will make sure you have 1 ab at the start and 1 cd at the end, in the middle you can whatever you want, it will work
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

app.get("/a(bc)?d", (req, res) => {
  // this makes (bc) optional. Will work for '/ad', '/abcd' but will not work for'/acd'
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

app.get("/a(bc)+d", (req, res) => {
  // same as previous 2 logics
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

//we can use regex also
app.get(/.*fly$/, (req, res) => {
  // this regex means it can start with anything but should have fly at the end, then it will work
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

//suppose the url is -> http://localhost:7777/user?userId=101&name=medha
//to read the query
app.get("/user", (req, res) => {
  console.log(req.query); // {userId: '101', name: 'medha'}
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

//suppose the url is -> http://localhost:7777/user/707/Medha/testing
app.get("/user/:userId/:name/:password", (req, res) => {
  // ':' means reading dynamic data
  console.log(req.params); // {userId: '707', name: 'Medha', password: 'testing'}
  res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

//if we don't send any response, it will go to an infinite loop, after a timeout it will fail
app.get("/user", (req, res) => {
  console.log(req.params);
});

//it can have multiple request handlers
//but in this case, it will again go to the first req handler, and as we are not sending res, it will go to infinite loop, it will not go to the 2nd handler
//if we had send the res in 1st handler, then also it would have only get the res of 1st handler, will not go to the 2nd 
app.get(
  "/user",
  (req, res) => {
    console.log(req.query); 
    
  },
  (req, res) => {
    
    res.send({ firstName: "Medhashree", lastName: "Moshat" });
  }
);

//if you want it to get the second handler, then write next(), it will get the 2nd handler res
//but if there was res.send() in 1st handler, then it will not move to the 2nd handler with next() also, it will get the 1st handler res, and will send it to client and
//an error is thrown, because Js Engine will still execute code line by line, but once the res is send to client, the same url/api cannot set headers again
app.get(
    "/user",
    (req, res, next) => {
      console.log(req.query); 
      
      next(); // this is provided by expressJS
    },
    (req, res) => {
      
      res.send({ firstName: "Medhashree", lastName: "Moshat" });
    }
  );

// this will not get any res in 1st, so will move to 2nd with next(), again no res, but as next() is present, it will try to move to the 3rd handler, but as there is no such req handler only it will throw an error 'Cannot GET /user'
//if there was a 3rd handler without res and next(), then would have gone in an infinite loop
  app.get(
    "/user",
    (req, res, next) => {
      console.log(req.query); 
      
      next();
    },
    (req, res, next) => {
      console.log("2nd handler");
      next();
    }
  );

// you can wrap all your req handlers within an array also, or some within arr, some outside arr, it will behave the same

//this will also work the same way, and our client will get the res from 2nd handler
app.get("/user", (req, res, next) => { // even here if it was '/' it would have behaved exactly the same, because it goes one by one and matches the url, and the moment it gets res, sends
    console.log("RH1");
    next()
});
app.get("/user", (req, res) => {
    console.log('RH2'); 
    res.send({ firstName: "Medhashree", lastName: "Moshat" });
});

//app.use is used for middlewares, will work for all url if the initial is matching, app.all is used for routing, will work only for the exact path

//always handle your logics within try...catch block, but if anytime any error arises, to handle that, we write this at end
//ordering matters, if written at start then maybe it will be called before any error has occurred, so nothing will happen
app.use('/', (err, req, res, next) => { // this order also matters
    if(err){
        res.status(500).send("something went wrong");
    }
}) 

//Listen to given port
app.listen("7777", () =>
  console.log("Server is successfully listening on port 7777...")
);
-----------------------------------------------------------------------------------------------------------------------
SCHEMA , APIs AND VALIDATION

//user.js
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: function (value){
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid: " + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate: function (value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Password is not strong(minLength: 8, 1 lowercase, 1 uppercase, 1 special character): " + value);
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      max: 80
    },
    gender: {
      type: String,
      validate: function (value){
        if(!['male', 'female', 'others'].includes(value)){
          throw new Error('Gender is not valid.')
        }
      }
    },
    about: {
      type: String,
      default: 'Hey! I am using DevTinder.'
    },
    profilePic: {
      type: String,
      default: "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg",
      validate: function (value){
        if(!validator.isURL(value)){
          throw new Error("Profile Picture URL is not valid: " + value);
        }
      }
    },
    skills: {
      type: [String],
      validate: function (value){
        if(value.length > 20){
          throw new Error('Cannot add more than 20 skills');
        }
      }
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);


//app.js
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



