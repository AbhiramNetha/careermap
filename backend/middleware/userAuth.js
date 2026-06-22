/**
 * Middleware to extract the Firebase user UID from headers.
 * Ensures the request is authenticated and has a valid user context.
 */
module.exports = (req, res, next) => {
    // Check for X-User-Uid or Authorization header
    let userId = req.headers['x-user-uid'] || req.headers['x-user-id'];

    if (!userId && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            userId = parts[1];
        }
    }

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized. Missing User Identifier.'
        });
    }

    // Set the userId on the request object for downstream controllers
    req.userId = userId;
    next();
};
