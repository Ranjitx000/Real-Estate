import mongoose from "mongoose";

const UserloginSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    role: {
      type: String,
      enum: ["admin", "agent", "owner", "user"],
      default: "user",
    },
      isVerified: { type: Boolean, default: false },
    
},
  { timestamps: true }
)


/// hashing password before saving user
UserloginSchema.pre("save",async function(next){
  if(this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
} )

/* Compare password */
UserloginSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserloginSchema);