export const STANDARD = {
  CREATED: 201,
  SUCCESS: 200,
  NOCONTENT: 204,
};

export const ERROR_404 = {
  statusCode: 404,
  message: 'NOT_FOUND',
};

export const ERROR_403 = {
  statusCode: 403,
  message: 'FORBIDDEN_ACCESS',
};

export const ERROR_401 = {
  statusCode: 401,
  message: 'UNAUTHORIZED',
};

export const ERROR_500 = {
  statusCode: 500,
  message: 'TRY_AGAIN',
};

export const ERROR_409 = {
  statusCode: 409,
  message: 'DUPLICATE_FOUND',
};

export const ERROR_400 = {
  statusCode: 400,
  message: 'BAD_REQUEST',
};
