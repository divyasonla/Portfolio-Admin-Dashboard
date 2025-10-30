import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();
const file = "./data/projects.json";
const SECRET = "mySecretKey";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

router.get("/", verifyToken, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data);
});

router.post("/", verifyToken, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  const newProject = { id: Date.now(), ...req.body };
  data.push(newProject);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json(newProject);
});

router.put("/:id", verifyToken, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  const index = data.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });
  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

router.delete("/:id", verifyToken, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  const filtered = data.filter((p) => p.id !== Number(req.params.id));
  fs.writeFileSync(file, JSON.stringify(filtered, null, 2));
  res.json({ message: "Deleted" });
});

export default router;
