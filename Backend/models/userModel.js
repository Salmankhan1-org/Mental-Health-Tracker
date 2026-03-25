const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // email regex
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["student", "admin","counsellor"],
    default: "student",
    index: true
  },
  profileImage: {
    type:String, trim:true
  },
  isActive : {
    type: Boolean,
    default : true
  },
  isDeleted : {
    type : Boolean,
    defaul : false
  },

  status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
        lowercase: true,
        trim: true
    },

  // Password reset
//   resetPasswordToken: { type: String, select: false },
//   resetPasswordExpiry: { type: Date },

  // Email verification
//   isEmailVerified: { type: Boolean, default: false },
//   emailVerificationCode: { type: String, select: false },
//   emailVerificationExpiry: { type: Date }

}, { timestamps: true });

userSchema.index({ email: 1, role: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
