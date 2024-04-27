const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    if (!token) {
      return next();
    }
    try {
      const payload = validateToken(token);
      req.user = payload;
    } catch (error) {}
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
