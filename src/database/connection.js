import sqlite3 from "sqlite3";
import Database from "./Database.js";

const database = new Database({
  url: process.env.SQLITE,
});

export default database;
