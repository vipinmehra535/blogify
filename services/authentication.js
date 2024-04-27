const jwt = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
