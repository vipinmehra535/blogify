const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/profileImage.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString("hex");
  const password = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = password;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedHash)
      throw new Error(" Incorrect Password");
    else {
      const token = createTokenForUser(user);
      return token;
    }
  }
);

User = model("users", userSchema);

module.exports = User;
