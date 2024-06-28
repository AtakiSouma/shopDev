"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";
var keyTokenSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: [String],
      require: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
