"use strict";
const shopModel = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.services");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const shopServices = require("./shop.services");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { generateKey } = require("../utils/generate_key");
const { removeKeyById } = require("./keyToken.services");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    /**1- check email in db*/
    const foundShop = await shopServices.findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }
    /**2 - check password */
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");
    /**3 - create accessToken refreshToken */
    const privateKey = generateKey();
    const publicKey = generateKey();
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    /**saves refreshToken in db */
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey: privateKey,
      publicKey: publicKey,
      userId: foundShop._id,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "email", "name"],
        object: foundShop,
      }),
      tokens,
    };
    /**4 - generate token */

    /**5 - get data and return login */
  };
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email: email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop already registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name: name,
        email: email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // });
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey });

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey: publicKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "Failed to store public key",
            status: "error",
          };
        }
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          message: "Shop registered successfully",
          status: 200,
          data: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
    } catch (error) {
      console.error("Error in signUp:", error); // Log the error for debugging
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore);
    console.log({ delKey });
    return delKey;
  };
}

module.exports = AccessService;
