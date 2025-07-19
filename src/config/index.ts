import * as Joi from 'joi';
import { config as awsConfig, schema as awsSchema } from './aws.config';

export const validationSchema = Joi.object({
  ...awsSchema,
});
export const config = [awsConfig];
