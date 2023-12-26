require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("i am alive!!!!!!!");
});
app.use("/user", userRouter);
app.use("/admin", adminRouter);

const main = () => {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URL);
  console.log("Application connected to mongoDB ......");
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
};

main();
