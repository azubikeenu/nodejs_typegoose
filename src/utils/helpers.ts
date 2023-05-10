import { ZodError } from 'zod';

export const helperUtils = {
  parseErrorMessage(error: ZodError) {
    return error.issues?.map((issue) => issue.message);
  },
};
