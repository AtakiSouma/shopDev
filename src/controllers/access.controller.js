"use strict";

const { CREATED, SuccessResponse } = require("../core/success.rresponse");
const AccessService = require("../services/access.services");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully!",
      metadata: await AccessService.logout(req.keyStore )
    }).send(res);
  };
}

module.exports = new AccessController();
