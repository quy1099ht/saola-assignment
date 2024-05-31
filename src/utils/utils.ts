import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
var jwt = require('jsonwebtoken');

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
  generateToken: (data: any) => {
    return jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
  },
  verifyToken: (token: any) => {
    try {
      return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return null;
    }
  },
};
