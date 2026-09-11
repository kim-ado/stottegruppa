// Authentication routes scaffolding
// TODO: Implement these endpoints

/**
 * POST /api/auth/register
 * - Create new user account
 * - Hash password with bcrypt
 * - Store user data in Redis
 * - Return user object with JWT token
 */
export const register = async (req, res) => {
    // TODO: Implement
    // const { username, email, password } = req.body;
    // - Validate input
    // - Check if user exists in Redis
    // - Hash password
    // - Store user in Redis: users:${username}
    // - Generate JWT token
    // - Set secure httpOnly cookie
    // - Return user data
};

/**
 * POST /api/auth/login
 * - Authenticate user with username/password
 * - Verify password against stored hash
 * - Return JWT token
 */
export const login = async (req, res) => {
    // TODO: Implement
    // const { username, password } = req.body;
    // - Validate input
    // - Fetch user from Redis: users:${username}
    // - Compare password with bcrypt
    // - Generate JWT token
    // - Set secure httpOnly cookie
    // - Return user data
};

/**
 * POST /api/auth/logout
 * - Clear authentication token/cookie
 */
export const logout = async (req, res) => {
    // TODO: Implement
    // - Clear httpOnly cookie
    // - Return success message
};

/**
 * GET /api/auth/me
 * - Get current authenticated user
 * - Requires valid JWT token
 */
export const getCurrentUser = async (req, res) => {
    // TODO: Implement
    // - Verify JWT token from cookie
    // - Fetch user from Redis using decoded token
    // - Return user data (without password)
};
