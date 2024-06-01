import { AccountType, CurrencyType } from '../models/payment-account.model';

export type Currency = 'USD' | 'VND' | 'EUR';
export interface IUserAuthToken {
  id: number;
  email: string;
}

export interface IGetPresign {
  fileName: string;
}

export interface IPutPresign {
  userId: number;
  fileName: string;
}

export interface ISignInBody {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginBody {
  username: string;
  password: string;
}

export interface ICreatePaymentAccountBody {
  accountType?: AccountType;
  balance?: number;
  currency?: CurrencyType;
}
export interface IEditPaymentAccountBody {
  paymentAccountId: string;
  accountType?: AccountType;
  balance?: number;
  isActive?: boolean;
  currency?: CurrencyType;
}

export interface IResponse {
  data: Object;
  status: number;
}
