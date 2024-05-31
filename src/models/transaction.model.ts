import mongoose, { Schema, Document } from 'mongoose';
import { PaymentAccountDocument } from './payment-account.model';
import { PaymentHistoryDocument } from './payment-history.model';

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

interface TransactionDocument extends Document {
  amount: number;
  timestamp: Date;
  fromAccountId?: mongoose.Schema.Types.ObjectId;
  toAccountId?: mongoose.Schema.Types.ObjectId;
  status: TransactionStatus;
  fromAccount?: PaymentAccountDocument;
  toAccount?: PaymentAccountDocument;
  histories: PaymentHistoryDocument[];
}

const transactionSchema = new Schema<TransactionDocument>({
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING },
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' },
  histories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentHistory' }],
});

const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);
export default Transaction;
export type { TransactionDocument, TransactionStatus };
