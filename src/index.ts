import express, { Application } from "express";
import { createDndRouter } from "./router";

const application: Application = express();

application.use(createDndRouter());

application.listen(3000, () => console.log("C'est good"));
