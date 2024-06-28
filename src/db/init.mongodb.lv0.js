"use strict";

const mongoose = require("mongoose");

const connectString =
  "mongodb+srv://hoangnam1772004:01685835912nam@cluster0.cr0cpyo.mongodb.net/arteaselkids?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(connectString)
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => console.log("error connect"));
if(1 === 0){
    mongoose.set('debug', true);
    mongoose.set('debug', {color: true})
}
module.exports = mongoose