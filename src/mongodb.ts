import * as mongoose from "mongoose";
import {News} from "./Model/news";

export const mongodb = async () => {
  await mongoose.connect("mongodb://localhost:27017/cnbeta");
  const db = mongoose.connection;
  db.on("error", (err) => {console.log(err); });
  return db;
};
