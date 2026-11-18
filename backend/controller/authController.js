import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOtpSMS } from "../utils/sms.js";






// 1. User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1️ Basic validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, phone, and password are required",
      });
    }

    // 2️ Check phone & email
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already registered" });
    }
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // 3️ ROLE MANAGEMENT (Security Critical)
    // We allow users to sign up as 'agent' or 'owner', but NEVER 'admin' directly.
    let userRole = "user"; // Default
    
    if (role && (role === "agent" || role === "owner")) {
      userRole = role;
    }
    // If someone tries to send "admin", we ignore it and set them as "user"
    if (role === "admin") {
      console.warn(`Security Alert: Phone ${phone} tried to register as Admin.`);
      userRole = "user"; 
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole, 
      isVerified: false // Good practice: Agents might need approval before posting
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong during registration",
    });
  }
};

// 2. User Login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // normalize to lowercase to match the schema's lowercase:true
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Admin Only: Change User Role
// Only an existing Admin can access this via the route: router.put('/update-role', protect, authorize('admin'), updateUserRole)
export const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        
        const validRoles = ["user", "agent", "owner", "admin"];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            { role: newRole }, 
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User role updated to ${newRole}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 4. Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      // Security: Don't reveal if user exists or not, just say "If account exists..."
      // But for dev debugging, we often return 404. 
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpSMS(phone, otp);

    res.status(200).json({ message: "OTP sent to your phone" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 5. Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const user = await User.findOne({
      phone,
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
