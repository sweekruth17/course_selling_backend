require("dotenv").config();
const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { Course, User } = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const { username, password } = req.headers;

  const check = await User.findOne({ username });
  if (check) {
    res
      .status(404)
      .json({ message: "username already taken choose another username" });
  }
  const hashPass = await bcrypt.hash(password, 10);
  const user = { username, password: hashPass };
  console.log(user);
  const result = await User.create(user);
  if (result) {
    res.status(200).json({ message: "successful signup", result: result });
  }
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;
  const result = await User.findOne({ username });
  if (result && (bcrypt.compare(password, result.password))) {
    const jwt = jwt.sign(result, process.env.SECRET_TOKEN, { expires: "10m" });
    res.status(200).json({ message: "Your credentials are correct", jwt });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const { username, password, Authorization } = req.headers;
  const jwt = Authorization.split(" ")[1];
  const check = jwt.verify(jwt, process.env.SECRET_TOKEN);
  if (check) {
    const result = await Course.find();
    if (result) {
      res.status(200).json({ all_available_courses: result });
    }
  } else {
    res.status(404).json({ message: "jwt Auth failed!!" });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const { username, password, Authorization } = req.headers;
  const jwt = Authorization.split(" ")[1];
  const check = jwt.verify(jwt, process.env.SECRET_TOKEN);
  if (check) {
    const courseId = req.query.courseId;
    const addcourse = await User.updateOne(
      { username: username },
      { $push: { mycourses: courseId.toString() } }
    );
    console.log(addcourse);
    const result = await User.findOne({ username: username });
    if (result && addcourse) {
      res.status(200).json({
        message: `Successfully purchased the course`,
        user: result,
      });
    }
  } else {
    res.status(404).json({ message: "jwt Auth failed!!" });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const { username, password, Authorization } = req.headers;
  const jwt = Authorization.split(" ")[1];
  const check = jwt.verify(jwt, process.env.SECRET_TOKEN);
  if (check) {
    const student = await User.findOne({ username });
    const purchasedCourses = student.mycourses;
    const result = await Course.find({
      _id: {
        $in: purchasedCourses,
      },
    });
    if (result) {
      res.status(200).json({ PurchaedCourses: result });
    }
  } else {
    res.status(404).json({ message: "jwt Auth failed!!" });
  }
});

module.exports = router;
