import "dotenv/config";
import express from "express";
import db from "./database/connection.js";
import routing from "./routing.js";
import cors from "cors";

const app = express();

const port = process.env.PORT ?? 3000;

app.use(cors());

app.use(express.json());

routing(app);

db.init().then(() => {
  app.listen(port, () => {
    console.log("Server running at:");
    console.log("http://localhost:" + port + "/");
  });
});
