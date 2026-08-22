import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  clerkId: {
  type: String,
  required: true,
  unique: true, // Taaki ek Clerk ID se ek hi account bane
},
},
{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;
