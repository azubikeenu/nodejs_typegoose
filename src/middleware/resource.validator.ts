import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

import Logger from '../utils/logger';
import { helperUtils } from '../utils/helpers';

const validateSchema =
  (schema: AnyZodObject) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: request.body,
        query: request.query,
        params: request.params,
      });
      return next();
    } catch (err: unknown) {
      const message = helperUtils.parseErrorMessage(err as ZodError);
      Logger.error(message);
      response.status(400).send({ success: false, message });
    }
  };

export default validateSchema;
