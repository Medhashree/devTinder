const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookies = require("cookie-parser");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const connectionRequestRouter = require("./router/connectionRequestRouter");
const userRouter = require("./router/userRouter");
const cors = require("cors");

app.use(express.json()); // this middleware(runs for all URLs), provided by express to read and convert JSON
app.use(cookies());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true //as we are using http
}))

app.use("/", authRouter);
app.use('/', profileRouter);
app.use('/', connectionRequestRouter);
app.use('/', userRouter);


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
