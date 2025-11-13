import { compare, hash } from 'bcrypt';
import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema(
  {
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
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema
  .virtual('passwordConfirm')
  .set(function (value) {
    this._passwordConfirm = value;
  })
  .get(function () {
    return this._passwordConfirm;
  });

userSchema.path('password').validate(function () {
  if (this.isModified('password')) {
    return this._passwordConfirm === this.password;
  }
  return true;
}, 'Passwords are not the same!!');

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });

//   next();
// });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hash(this.password, 12);
  this._passwordConfirm = undefined;
  this.passwordChangedAt = Date.now();

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedAtTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedAtTimestamp;
  }

  return false;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);

export default User;
