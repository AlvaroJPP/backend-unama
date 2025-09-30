import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.ts";
import organizationRoutes from "./routes/organizationRoutes.ts";
import categoryRoutes from "./routes/categoryRoutes.ts";
import eventRoutes from "./routes/eventRoutes.ts";
import eventImageRoutes from "./routes/eventImageRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-images", eventImageRoutes);
app.use("/api/comments", commentRoutes);


export default app;
