const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { Course, User } = require("../db/index");
const router = Router();

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const { username, password } = req.headers;
  const user = { username, password };
  console.log(user);
  const result = await User.create(user);
  if (result) {
    res.status(200).json({ message: "successful signup", result: result });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const result = await Course.find();
  if (result) {
    res.status(200).json({ all_available_courses: result });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const { username, password } = req.headers;
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
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const { username, password } = req.headers;
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
});

module.exports = router;
