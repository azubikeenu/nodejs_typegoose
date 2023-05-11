import {
  Severity,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';

import { v4 as uuid } from 'uuid';

import config from 'config';

import bcrypt from 'bcrypt';

export const privateFields = [
  'verificationCode',
  'password',
  'passwordResetCode',
  'verified',
  '__v',
];

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(config.get<number>('saltWalkFactor'));
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ email: 1 })
export class User {
  @prop({ lowercase: true, unique: true, required: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => uuid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
