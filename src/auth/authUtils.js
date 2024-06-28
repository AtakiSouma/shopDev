"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("./checkAuth");
const { AUTH_HEADER } = require("../constants/auth_data");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.services");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days", // Correcting to a proper expiration time
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error Verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in createTokenPair:", error); // Log the error for debugging
    throw error;
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  /* 
    1- check userId missing?
    2. get accessToken 
    3. verify token
    4.  check user in dbs
    5. check keyStore with this userID
    6. OK all -> next
*/
  const userId = req.headers[AUTH_HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found key");
  }
  const accessToken = req.headers[AUTH_HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid request");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {}
});
module.exports = { createTokenPair, authentication };
