import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, STANDARD } from '../utils/constants';
import { ERRORS, handleServerError } from '../utils/errors';
import { ILoginBody, ISignInBody } from '../interfaces';
import { utils } from '../utils/utils';
import User from '../models/user.model';
import PaymentAccount from '../models/payment-account.model';

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password } = request.body as ILoginBody;
    const user = await User.findOne({ username: username });
    if (!user) {
      throw ERRORS.userNotExists;
    }

    // const hashPass = await utils.genSalt(10, password)
    const checkPass = await utils.compareHash(user.passwordHash, password);
    if (!checkPass) {
      throw ERRORS.userCredError;
    }

    const tempUser = {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = utils.generateToken({
      ...tempUser,
    });

    reply.code(STANDARD.SUCCESS).send({
      data: {
        token,
        user: {
          ...tempUser,
        },
      },
      status: STANDARD.SUCCESS,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, password, firstName, lastName } = request.body as ISignInBody;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw ERRORS.userExists;
    }

    const hashPass = await utils.genSalt(10, password);
    const newUser = new User({
      username,
      firstName,
      lastName,
      passwordHash: hashPass,
    });
    await newUser.save();

    const accountNumber = await utils.generateAccountNumber();
    const newAccount = new PaymentAccount({
      userId: newUser._id,
      accountType: 'DEBIT',
      accountNumber,
      balance: 0.0,
    });
    await newAccount.save();

    reply.code(STANDARD.SUCCESS).send({
      data: utils.sanitizeUserData(newUser),
      status: STANDARD.SUCCESS,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};
