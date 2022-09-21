import mongoose from 'mongoose';
import { UserType } from '../../types/user-type.enum';
import { User } from '../../types/user.type.js';

export interface UserDocument extends User, mongoose.Document {
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: [1, 'Min length for name is 1'],
  },
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    match: [/\.(?:jpg|png)$/i, 'Allowed file types: .jpg, .png'],
  },
  password: {
    type: String,
    minlength: [6, 'Min length for password is 6'],
    maxlength: [12, 'Max length for password is 12'],
    require: true,
  },
  userType: {
    type: UserType,
    require: true,
  },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
