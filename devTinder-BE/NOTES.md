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
