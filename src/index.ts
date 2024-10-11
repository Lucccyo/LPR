import express from "express";
import morgan from "morgan";
import { dndRouter } from "./dnd-router";

const application = express();

application.use(morgan("tiny"));
application.use("/dnd", dndRouter);

application.listen(3000, () => console.log("Server is running on port 3000"));