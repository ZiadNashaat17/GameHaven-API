import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: validator.isEmail,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!!',
    },
  },
});

const User = model('User', userSchema);

export default User;
