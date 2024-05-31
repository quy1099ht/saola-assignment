import path from 'path';
import envSchema from 'env-schema';
import S from 'fluent-json-schema';
import { utils } from '../utils/utils';

export default function loadConfig(): void {
  // Load environment variables from .env file
  const result = require('dotenv').config({
    path: path.join(__dirname, '..', '..', '.env'),
  });

  // Check for errors in loading the .env file
  if (result.error) {
    throw new Error(result.error);
  }

  // Define the schema for environment variables
  const schema = S.object()
    .prop('PORT', S.number().required())
    .prop('SECRET_KEY', S.string().required())
    .prop('DATABASE_URL', S.string().required());

  const config = envSchema({
    data: result.parsed,
    schema,
  });

  console.log('Configuration loaded:', config);
}
