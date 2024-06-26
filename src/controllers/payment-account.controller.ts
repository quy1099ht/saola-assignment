import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_400, ERROR_500, STANDARD } from '../utils/constants';
import { CustomError, handleServerError } from '../utils/errors';
import { ICreatePaymentAccountBody, IEditPaymentAccountBody } from '../interfaces';
import { utils } from '../utils/utils';
import { auth } from '../utils/auth';
import PaymentAccount, { CurrencyType } from '../models/payment-account.model';
import Transaction from '../models/transaction.model';
import PaymentHistory from '../models/payment-history.model';

export const createPaymentAccount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { accountType, balance, currency } = request.body as ICreatePaymentAccountBody;
    const user = await auth.getUser(request);

    const accountNumber = await utils.generateAccountNumber();
    const newAccount = new PaymentAccount({
      userId: user._id,
      accountType: accountType || 'DEBIT', // Default should be debit.
      currency: currency || CurrencyType.USD,
      accountNumber,
      balance: balance || 0.0,
    });
    await newAccount.save();

    user.accounts.push(newAccount);
    await user.save();

    reply.status(STANDARD.CREATED).send(
      utils.standardizedAPIResponse(
        {
          user: utils.sanitizeUserData(user),
          account: newAccount,
        },
        STANDARD.CREATED,
      ),
    );
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const editPaymentAccount = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { paymentAccountId, accountType, balance, isActive, currency } =
      request.body as IEditPaymentAccountBody;
    const user = await auth.getUser(request);

    if (!paymentAccountId)
      return reply.status(ERROR_400.statusCode).send({
        status: ERROR_400.statusCode,
        message: ERROR_400.message,
      });

    const paymentAccount = await PaymentAccount.findById(paymentAccountId);

    const result = await PaymentAccount.updateOne(
      { userId: user._id, _id: paymentAccount?._id },
      {
        accountType: accountType || paymentAccount?.accountType,
        balance: balance || paymentAccount?.balance,
        isActive: isActive || paymentAccount?.isActive,
        currency: currency || paymentAccount?.currency,
      },
    );

    if (!result.acknowledged)
      throw new CustomError(`${ERROR_500}`, 'Edit Payment Account unsuccessfully.');

    return reply.status(STANDARD.SUCCESS).send(
      utils.standardizedAPIResponse(
        {
          user: utils.sanitizeUserData(user),
          account: {
            ...paymentAccount,
            accountType: accountType || paymentAccount?.accountType,
            balance: balance || paymentAccount?.balance,
            isActive: isActive || paymentAccount?.isActive,
            currency: currency || paymentAccount?.currency,
          },
        },
        STANDARD.CREATED,
      ),
    );
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const getUserPaymentAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await auth.getUser(request);
    const paymentAccounts = await PaymentAccount.find({ userId: user._id });

    for (let i = 0; i < paymentAccounts.length; i++) {
      paymentAccounts[i].toTransactions = await Transaction.find({
        toAccountId: paymentAccounts[i].id,
      });
      paymentAccounts[i].fromTransactions = await Transaction.find({
        fromAccountId: paymentAccounts[i].id,
      });
      paymentAccounts[i].histories = await PaymentHistory.find({
        accountId: paymentAccounts[i].id,
      });
    }



    reply.status(STANDARD.CREATED).send(
      utils.standardizedAPIResponse(
        {
          user: utils.sanitizeUserData(user),
          accounts: paymentAccounts,
        },
        STANDARD.CREATED,
      ),
    );
  } catch (err) {
    handleServerError(reply, err);
  }
};
