const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = function (req, res, next) {
  // Check if the authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({
      success: false,
      message: "Authorization header is missing",
    });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    // Verify the token
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Verified Token:", verifiedToken);

    // Attach userId to req.user
    req.user = { userId: verifiedToken.userId, _id: verifiedToken.userId };

    // Fetch the complete user data to get isAdmin status
    User.findById(verifiedToken.userId)
      .then(user => {
        if (user) {
          req.user.isAdmin = user.isAdmin;
        }
        next(); // Proceed to the next middleware or route handler
      })
      .catch(err => {
        console.error("Error fetching user data in middleware:", err);
        next(); // Still proceed even if there's an error fetching user data
      });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid Token",
    });
  }
};