import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, ERROR_500, STANDARD } from '../utils/constants';
import { CustomError, ERRORS, handleServerError } from '../utils/errors';
import {
  ICreatePaymentAccountBody,
  IEditPaymentAccountBody,
  ILoginBody,
  ISignInBody,
} from '../interfaces';
import { utils } from '../utils/utils';
import User from '../models/user.model';
import { auth } from '../utils/auth';
import PaymentAccount from '../models/payment-account.model';

export const createPaymentAccount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { accountType, balance } = request.body as ICreatePaymentAccountBody;
    const user = await auth.getUser(request);

    const accountNumber = await utils.generateAccountNumber();
    const newAccount = new PaymentAccount({
      userId: user._id,
      accountType: accountType || 'DEBIT', // Default should be debit.
      accountNumber,
      balance: balance || 0.0,
    });
    await newAccount.save();

    reply.status(STANDARD.CREATED).send({
      data: {
        user: utils.sanitizeUserData(user),
        account: newAccount,
      },
      statusCode: STANDARD.CREATED,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const editPaymentAccount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { paymentAccountId, accountType, balance, isActive } =
      request.body as IEditPaymentAccountBody;
    const user = await auth.getUser(request);

    if (!paymentAccountId)
      return reply.status(ERROR_400.statusCode).send({
        statusCode: ERROR_400.statusCode,
        message: ERROR_400.message,
      });

    const paymentAccount = await PaymentAccount.findById(paymentAccountId);

    const result = await PaymentAccount.updateOne(
      { userId: user._id, _id: paymentAccount?._id },
      {
        accountType: accountType || paymentAccount?.accountType,
        balance: balance || paymentAccount?.balance,
        isActive: isActive || paymentAccount?.isActive,
      },
    );

    if (!result.acknowledged)
      throw new CustomError(`${ERROR_500}`, 'Edit Payment Account unsuccessfully.');

    return reply.status(STANDARD.SUCCESS).send({
      data: {
        user: utils.sanitizeUserData(user),
        account: {
          ...paymentAccount,
          accountType: accountType || paymentAccount?.accountType,
          balance: balance || paymentAccount?.balance,
          isActive: isActive || paymentAccount?.isActive,
        },
      },
      statusCode: STANDARD.CREATED,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const getUserPaymentAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await auth.getUser(request);
    const paymentAccounts = await PaymentAccount.find({ userId: user._id });

    reply.status(STANDARD.CREATED).send({
      data: {
        user: utils.sanitizeUserData(user),
        accounts: paymentAccounts,
      },
      statusCode: STANDARD.CREATED,
    });
  } catch (err) {
    handleServerError(reply, err);
  }
};
