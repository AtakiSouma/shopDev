"use strict";

const mongoose = require("mongoose");

const connectString =
  "mongodb+srv://hoangnam1772004:01685835912nam@cluster0.cr0cpyo.mongodb.net/shop_TIP?retryWrites=true&w=majority&appName=Cluster0";
class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize:100
      })
      .then(() => console.log("Mongo DB connected Pro"))
      .catch((err) => console.log("error connect"));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
