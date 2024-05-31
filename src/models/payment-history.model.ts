import mongoose, { Schema, Document } from 'mongoose';
import { PaymentAccountDocument } from './payment-account.model';
import { TransactionDocument } from './transaction.model';

interface PaymentHistoryDocument extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  transactionId: mongoose.Schema.Types.ObjectId;
  account: PaymentAccountDocument;
  transaction: TransactionDocument;
  createdAt: Date;
}

const paymentHistorySchema = new Schema<PaymentHistoryDocument>({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount', required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  createdAt: { type: Date, default: Date.now },
});

const PaymentHistory = mongoose.model<PaymentHistoryDocument>('PaymentHistory', paymentHistorySchema);
export default PaymentHistory;
export type { PaymentHistoryDocument };
