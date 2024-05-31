import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from './user.model';
import { TransactionDocument } from './transaction.model';
import { PaymentHistoryDocument } from './payment-history.model';

enum AccountType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  LOAN = 'LOAN',
}

interface PaymentAccountDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  accountType: AccountType;
  accountNumber: string;
  balance: number;
  createdAt: Date;
  isActive: boolean;
  user: UserDocument;
  fromTransactions: TransactionDocument[];
  toTransactions: TransactionDocument[];
  histories: PaymentHistoryDocument[];
}

const paymentAccountSchema = new Schema<PaymentAccountDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountType: { type: String, enum: Object.values(AccountType), required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0.0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  fromTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  toTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  histories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentHistory' }],
});

const PaymentAccount = mongoose.model<PaymentAccountDocument>(
  'PaymentAccount',
  paymentAccountSchema,
);
export default PaymentAccount;
export type { PaymentAccountDocument, AccountType };
