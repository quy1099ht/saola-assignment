import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { defaultSecretKey, exchangeRates } from './constants';
import PaymentAccount from '../models/payment-account.model';
import { UserDocument } from '../models/user.model';
import { Currency, IResponse } from '../interfaces';

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
    return jwt.sign(data, process.env.SECRET_KEY || defaultSecretKey, {
      expiresIn: '1h',
    });
  },
  verifyToken: (token: any) => {
    try {
      return jwt.verify(token, process.env.SECRET_KEY || defaultSecretKey);
    } catch (error) {
      return null;
    }
  },
  getBearerToken: (authHeader: string | undefined) => {
    return authHeader?.split(' ')[1];
  },
  generateAccountNumber: async () => {
    let accountNumber;
    let isUnique = false;
    while (!isUnique) {
      accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a 10-digit number
      const existingAccount = await PaymentAccount.findOne({ accountNumber });
      if (!existingAccount) {
        isUnique = true;
      }
    }
    return accountNumber;
  },
  sanitizeUserData: (user: UserDocument) => {
    return {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastname: user.lastName,
    };
  },
  convertCurrency: (amount: number, from: Currency, to: Currency): number => {
    if (from === to) {
      return amount;
    }

    const rate = exchangeRates[from][to];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    return amount * rate;
  },
  standardizedAPIResponse: (data: Object, status: number): IResponse => {
    return {
      data,
      status,
    };
  },
};
