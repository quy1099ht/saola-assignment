import mongoose, { Schema, Document } from 'mongoose';
import { PaymentAccountDocument } from './payment-account.model';

interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  isActive: boolean;
  accounts: PaymentAccountDocument[];
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount' }],
});

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
export type { UserDocument };
