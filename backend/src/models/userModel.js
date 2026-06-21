import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;   // never expose password in JSON
        delete ret.__v;        // remove version key
        ret.id = ret._id.toString(); // expose `id` as a string
        delete ret._id;        // remove Mongo `_id`
        return ret;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

export default User;
