const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { User } = require("../db/index.js");

async function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const { username, password } = req.headers;
  const dbData = await User.findOne({ username });
  const emailSchema = zod.string().email();
  const passwordSchema = zod.string().min(6);
  const checkEmail = emailSchema.safeParse(username);
  const checkPassword = passwordSchema.safeParse(password);
  if (!checkEmail.success || !checkPassword.success) {
    res.status(404).json({ message: "Please enter valid credentials again" });
  }
  if (dbData.username !== username && dbData.password !== password) {
    res.status(404).json({ message: "wrong credentials" });
  }
  next();
}

module.exports = userMiddleware;
