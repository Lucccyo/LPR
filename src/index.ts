import express, { Application } from "express";
import { router } from "./router";

const application : Application = express();

application.use(router);

application.listen(3000, () => console.log("C'est good"))

