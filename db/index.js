require("dotenv").config();
const mongoose = require("mongoose");

// // Connect to MongoDB
//mongoose.connect(process.env.MONGODB_URL);
const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: { type: String, required: [true, "Please enter Todo title..!!"] },
  description: {
    type: String,
    required: [true, "Please enter Todo description..!!"],
  },
  price: { type: Number, required: [true, "Please enter course price..!!"] },
  imageUrl: { type: String, required: true },
  published: { type: Boolean },
});
// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: { type: String },
  password: { type: String },
  createdcourses: { type: [String] },
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: { type: String },
  password: { type: String },
  mycourses: { type: [String] },
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
