import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError, ERRORS, handleServerError } from '../utils/errors';
import { auth } from '../utils/auth';
import { ISendBody, IWithdrawBody } from '../interfaces';
import PaymentAccount, { PaymentAccountDocument } from '../models/payment-account.model';
import { ERROR_400, STANDARD } from '../utils/constants';
import Transaction, { TransactionDocument, TransactionStatus } from '../models/transaction.model';
import { utils } from '../utils/utils';
import PaymentHistory from '../models/payment-history.model';

const handleFailedTransaction = async (
  transaction: TransactionDocument,
  paymentAccount: PaymentAccountDocument | undefined | null,
) => {
  transaction.status = 'FAILED' as TransactionStatus.FAILED;
  await transaction?.save();
  paymentAccount?.fromTransactions.push(transaction);
  await paymentAccount?.save();
  // Create Payment history;
  const newPaymentHistory = new PaymentHistory({
    account: paymentAccount,
    accountId: paymentAccount?._id,
    transaction: transaction,
    transactionId: transaction._id,
  });

  await newPaymentHistory.save();

  paymentAccount?.histories.push(newPaymentHistory);
  await paymentAccount?.save();
};

export const withdraw = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { paymentAccountId, moneyAmount } = request.body as IWithdrawBody;
    const user = await auth.getUser(request);

    if (!paymentAccountId)
      return reply.status(ERROR_400.statusCode).send({
        status: ERROR_400.statusCode,
        message: ERROR_400.message,
      });

    if (!moneyAmount) throw new CustomError(`${ERROR_400.statusCode}`, 'Withdawal Money not found');

    const paymentAccount = await PaymentAccount.findById(paymentAccountId);

    if (paymentAccount?.userId.toString() !== user.id) throw ERRORS.unAuthorizedAccesss;

    const transaction = new Transaction({
      amount: moneyAmount,
      currency: paymentAccount?.currency,
      fromAccount: paymentAccount,
      fromAccountId: paymentAccount?._id,
      status: 'PENDING',
    });
    await transaction.save();

    if (paymentAccount?.balance === undefined) {
      handleFailedTransaction(transaction, paymentAccount);

      throw new Error('Saving balance error');
    }
    // Check account balance
    if (moneyAmount > paymentAccount?.balance) {
      handleFailedTransaction(transaction, paymentAccount);

      throw new CustomError(`${ERROR_400.statusCode}`, 'Not enough money to withdraw');
    }

    transaction.status = 'COMPLETED' as TransactionStatus.COMPLETED;

    await transaction.save();
    paymentAccount.balance -= utils.convertCurrency(
      moneyAmount,
      paymentAccount.currency,
      paymentAccount.currency,
    ); // Since it's withdrawing so there is no need for a different currency. This might change if there is a need for withdraw money in different currency

    paymentAccount.fromTransactions.push(transaction);
    await paymentAccount.save();

    // Create Payment history;
    const newPaymentHistory = new PaymentHistory({
      account: paymentAccount,
      accountId: paymentAccount._id,
      transaction: transaction,
      transactionId: transaction._id,
    });

    await newPaymentHistory.save();

    paymentAccount.histories.push(newPaymentHistory);
    await paymentAccount.save();

    reply.status(STANDARD.SUCCESS).send(utils.standardizedAPIResponse({}, STANDARD.SUCCESS));
  } catch (err) {
    handleServerError(reply, err);
  }
};

export const send = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { paymentAccountId, moneyAmount, toPaymentAccountId } = request.body as ISendBody;
    const user = await auth.getUser(request);

    if (!paymentAccountId)
      return reply.status(ERROR_400.statusCode).send({
        status: ERROR_400.statusCode,
        message: ERROR_400.message,
      });

    if (!moneyAmount) throw new CustomError(`${ERROR_400.statusCode}`, 'Withdawal Money not found');

    const paymentAccount = await PaymentAccount.findById(paymentAccountId);
    const toPaymentAccount = await PaymentAccount.findById(toPaymentAccountId);

    if (!paymentAccount || !toPaymentAccount) throw ERRORS.accountNotFound;
    if (paymentAccount?.userId.toString() !== user.id) throw ERRORS.unAuthorizedAccesss;

    const transaction = new Transaction({
      amount: moneyAmount,
      currency: paymentAccount?.currency,
      fromAccount: paymentAccount,
      fromAccountId: paymentAccount?._id,
      toPaymentAccount: toPaymentAccount,
      toPaymentAccountId: toPaymentAccountId,
      status: 'PENDING',
    });
    await transaction.save();

    if (paymentAccount?.balance === undefined) {
      handleFailedTransaction(transaction, paymentAccount);
      throw new Error('Saving balance error');
    }
    // Check account balance
    if (moneyAmount > paymentAccount?.balance) {
      handleFailedTransaction(transaction, paymentAccount);
      throw new CustomError(`${ERROR_400.statusCode}`, 'Not enough money to send');
    }

    if (!toPaymentAccount.isActive) {
      handleFailedTransaction(transaction, paymentAccount);
      throw new Error('Targeted Account is disabled.');
    }

    transaction.status = 'COMPLETED' as TransactionStatus.COMPLETED;

    await transaction.save();
    paymentAccount.balance -= utils.convertCurrency(
      moneyAmount,
      paymentAccount.currency,
      paymentAccount.currency,
    );

     toPaymentAccount.balance += utils.convertCurrency(
      moneyAmount,
      paymentAccount.currency,
      toPaymentAccount.currency,
    );

    paymentAccount.fromTransactions.push(transaction);
    await paymentAccount.save();
    
    toPaymentAccount.toTransactions.push(transaction);
    await toPaymentAccount.save();

    // Create Payment history;
    const newPaymentHistory = new PaymentHistory({
      account: paymentAccount,
      accountId: paymentAccount._id,
      transaction: transaction,
      transactionId: transaction._id,
    });

    await newPaymentHistory.save();

    paymentAccount.histories.push(newPaymentHistory);
    await paymentAccount.save();

    reply.status(STANDARD.SUCCESS).send(utils.standardizedAPIResponse({}, STANDARD.SUCCESS));
  } catch (err) {
    handleServerError(reply, err);
  }
};
