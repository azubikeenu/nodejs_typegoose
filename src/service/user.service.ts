import { FilterQuery } from 'mongoose';
import UserModel, { User } from '../model/user.model';
import { omit } from 'lodash';

export async function createUser(user: Partial<User>) {
  try {
    const createdUser = await UserModel.create(user);
    return omit(createdUser.toJSON(), 'password', '__v');
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new Error(`email already exists in the database`);
    }
    throw new Error(error.message);
  }
}

export async function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function findUserByEmail(query: FilterQuery<User>) {
  return UserModel.findOne(query);
}

export async function validatePassword(email: string, password: string) {
  const user = await findUserByEmail({ email });

  if (!user || !(await user.validatePassword(password))) {
    return false;
  }
  return user;
}
