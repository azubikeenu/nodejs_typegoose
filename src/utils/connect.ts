import mongoose from 'mongoose';
import config from 'config';
import Logger from './logger';

export async function connect() {
  const dbUrl = config.get<string>('dbUrl');
  try {
    await mongoose.connect(dbUrl);
    Logger.info(`database connected successfully`);
  } catch (err: any) {
    Logger.error(`Database connection failed ${err?.message}`);
    process.exit(1);
  }
}
