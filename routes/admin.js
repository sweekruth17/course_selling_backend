const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Course, Admin } = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;
  const user = { username, password };
  console.log(user);
  const result = await Admin.create(user);
  if (result) {
    res.status(200).json({ message: "successful signup", result: result });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const { username, password } = req.headers;
  const creator = await Admin.findOne({ username });
  const { title, description, price, imageUrl, published } = req.body;
  if (!title || !description || !price || !imageUrl || !published) {
    res.status(401).json({ message: "Parameters missing" });
  }
  const newCourse = {
    title,
    description,
    price,
    imageUrl,
    published,
  };
  const result = await Course.create(newCourse);
  const addcourse = await Admin.updateOne(
    { _id: creator._id },
    { $push: { createdcourses: result["_id"].toString() } }
  );
  console.log("addcourse:", JSON.stringify(addcourse));

  if (result && addcourse) {
    res.status(200).json({
      message: `course ${title} created and added under ${username}`,
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const { username, password } = req.headers;
  const creator = await Admin.findOne({ username });
  const courses = creator.createdcourses; // all the ID's of courses
//   for(let i in courses) console.log("course ids",courses[i]);
    const result = await Course.find({
      _id: {
        $in: courses,
      },
    });
    if (result) {
      res.status(200).json({ All_courses: result });
    }
//   res.status(200);
});

module.exports = router;
