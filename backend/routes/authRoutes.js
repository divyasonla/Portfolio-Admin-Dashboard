import express from "express";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const file = "./data/users.json";
const SECRET = "mySecretKey";

router.post("/signup", (req, res) => {
  const users = JSON.parse(fs.readFileSync(file));
  const { email, password } = req.body;

  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "User already exists" });

  const hashed = bcrypt.hashSync(password, 8);
  users.push({ id: Date.now(), email, password: hashed });
  fs.writeFileSync(file, JSON.stringify(users, null, 2));

  res.json({ message: "Signup successful" });
});

router.post("/login", (req, res) => {
  const users = JSON.parse(fs.readFileSync(file));
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export default router;
