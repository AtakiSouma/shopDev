const shopModel = require("../models/shop.models");
const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    role: 1,
  },
}) => {
  return shopModel.findOne({ email }).select(select).lean();
};
module.exports = {
  findByEmail,
};
