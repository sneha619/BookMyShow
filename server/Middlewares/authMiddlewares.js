const jwt = require("jsonwebtoken");

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

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid Token",
    });
  }
};