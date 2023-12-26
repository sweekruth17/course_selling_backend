// Middleware for handling auth
const { Admin } = require("../db/index.js");
const app = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const { username, password } = req.headers;
  const dbData = await Admin.findOne({ username });
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

module.exports = adminMiddleware;
