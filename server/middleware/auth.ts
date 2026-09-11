/**
 * Authentication Middleware Scaffolding
 * TODO: Implement these middleware functions
 */

/**
 * Verify JWT token from httpOnly cookie
 * - Extract token from cookie
 * - Verify token signature using JWT_SECRET
 * - Check token expiration
 * - Decode and attach user info to request
 * - Call next() or return 401 error
 */
export const authenticateToken = (req, res, next) => {
    // TODO: Implement
    // const token = req.cookies.authToken;
    // if (!token) return res.status(401).json({ error: 'No token provided' });
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = decoded;
    //   next();
    // } catch (error) {
    //   res.status(403).json({ error: 'Invalid token' });
    // }
};

/**
 * Check if user is a member
 * - Requires authenticateToken middleware
 * - Verify user.isMember is true
 * - Call next() or return 403 error
 */
export const requireMember = (req, res, next) => {
    // TODO: Implement
    // if (!req.user.isMember) {
    //   return res.status(403).json({ error: 'Member access required' });
    // }
    // next();
};

/**
 * Check if user is admin
 * - Requires authenticateToken middleware
 * - Verify user.role is 'admin'
 * - Call next() or return 403 error
 */
export const requireAdmin = (req, res, next) => {
    // TODO: Implement
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }
    // next();
};

/**
 * Global error handler middleware
 * - Log error details
 * - Return appropriate status code and message
 * - Don't expose sensitive error details in production
 */
export const errorHandler = (err, req, res, next) => {
    // TODO: Implement
    // console.error('Error:', err);
    // const status = err.status || 500;
    // const message = process.env.NODE_ENV === 'production' 
    //   ? 'Internal server error' 
    //   : err.message;
    // res.status(status).json({ error: message });
};

/**
 * Validation middleware
 * - Validate request body against schema
 * - Return 400 if validation fails
 * - Call next() if valid
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        // TODO: Implement with joi or zod
        // const { error, value } = schema.validate(req.body);
        // if (error) {
        //   return res.status(400).json({ error: error.details });
        // }
        // req.body = value;
        // next();
    };
};
