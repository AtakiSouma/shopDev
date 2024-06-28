"use strict";

// level 0

const dev = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    host: process.env.DB_DEV_HOST,
    port: process.env.DB_DEV_PORT,
    name: process.env.DB_DEV_NAME,
  },
};

const pro = {
  app: {
    port: process.env.PORT || 5000,
  },
  db: {
    host: process.env.DB_PRO_HOST,
    port: process.env.DB_PRO_PORT,
    name: process.env.DB_PRO_NAME,
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config;
