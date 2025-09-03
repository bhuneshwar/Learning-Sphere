// src/middlewares/roleMiddleware.js
const roleMiddleware = (requiredRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Forbidden: User not authenticated' });
    }
    
    // Handle both single role (string) and multiple roles (array)
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
};

module.exports = roleMiddleware;
