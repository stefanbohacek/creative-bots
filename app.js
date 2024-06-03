import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import bodyParser from "body-parser";
import indexRoute from "./routes/index.js";
const app = express();

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

console.log("loading app...");

app.use("/", indexRoute);
app.use("/images", express.static(__dirname + "/temp/"));

app.use(express.static("public"));
app.use(express.static("views"));

export default app;
