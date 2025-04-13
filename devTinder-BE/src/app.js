const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookies = require("cookie-parser");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const connectionRequestRouter = require("./router/connectionRequestRouter");

app.use(express.json()); // this middleware(runs for all URLs), provided by express to read and convert JSON
app.use(cookies());

app.use("/", authRouter);
app.use('/', profileRouter);
app.use('/', connectionRequestRouter);


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
