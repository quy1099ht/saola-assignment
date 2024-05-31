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
