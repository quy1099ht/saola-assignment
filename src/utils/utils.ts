import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },
  getTime: () => {
    const date = new Date();
    const time = date.getTime();
    return time;
  },
  genSalt: (saltRounds: any, value: any) => {
    return new Promise((resolve, reject) => {
      const salt = bcrypt.genSaltSync(saltRounds);
      bcrypt.hash(value, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  },
  compareHash: (hash: any, value: any) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(value, hash, (err, result): boolean | any => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  test: () => {
    return { result: "Done" };
  },
};
