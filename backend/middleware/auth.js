import jwt from 'jsonwebtoken';

// Middleware to authenticate users by verifying JWT token from request headers
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];

    // If no token found, reject the request with unauthorized status
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the userId from decoded token to request object for use in next handlers
    req.userId = decoded.userId;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid/expired tokens
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;