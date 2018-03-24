import {Document, Model, model, Schema} from "mongoose";

interface INews extends Document {
  title: string;
  url: string;
  time: Date;
  content: string;
}

const NewsSchema = new Schema({
  content: String,
  time: Date,
  title: String,
  url: String,
});

export const News: Model<INews> = model<INews>("News", NewsSchema);
