import jwt from 'jsonwebtoken';

// Authenticate Token Middleware
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      const errorMessage = err.name === 'TokenExpiredError' ? 'Token has expired.' : 'Invalid token.';
      return res.status(403).json({ message: errorMessage });
    }
    req.user = user; // Attach user data to the request
    next(); // Proceed to the next middleware/route handler
  });
};

// Role-based Authorization Middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    
    if (!req.user || !roles.includes(req.user.role)) {  // Ensure req.user exists before checking role
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }
    next(); // User has the correct role, proceed to the next middleware/route handler
  };
};
