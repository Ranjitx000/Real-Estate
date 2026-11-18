import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserloginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,          // allows multiple docs with null email
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,              
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,            
    },

    role: {
      type: String,
      enum: ["admin", "agent", "owner", "user"],
      default: "user",
    },

    // OTP reset
    resetOtp: String,
    resetOtpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/// 🔐 Hash password before save
UserloginSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/// 🔑 Compare password
UserloginSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserloginSchema);
