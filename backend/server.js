import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js"
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
