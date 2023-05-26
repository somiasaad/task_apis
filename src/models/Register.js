const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Email is INVALID");
      }
    },
  },
  Password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      let password = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!password.test(value)) {
        throw new Error(
          "Password must include uppercase , lowercase , numbers , speacial characters"
        );
      }
    },
  },
  ConfirmPassword: {
    type: String,
    required: true,
    trim: true,
  },
});

//////////////////////////////////////////////////////////////////////////////////////
userSchema.pre("save", async function () {
  const user = this; //  => Document

  if (user.isModified("Password")) {
    user.Password = await bcryptjs.hash(user.Password, 8);
    user.ConfirmPassword = await bcryptjs.hash(user.ConfirmPassword, 8);
  }
});

///////////////////////////////////////////////////////////////////////////

// Login

userSchema.statics.findByCredentials = async (Email, Password) => {
  const user = await User.findOne({ Email: Email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcryptjs.compare(Password, user.Password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
