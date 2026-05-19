import mongoose from "mongoose";

// creating new structure
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // require -> required
  },

  age: {
    type: Number,
    required: true,
  },

  password: {
    type: String, // Number না, String হওয়া উচিত
    required: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;