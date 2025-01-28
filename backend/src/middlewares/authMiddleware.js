const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
 const token = req.header('Authorization')?.split(' ')[1];
 if (!token) {
   return res.status(401).json({ message: 'Unauthorized: Token missing' });
 }
 try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = decoded;
   next();
 } catch (err) {
   if (err.name === 'TokenExpiredError') {
     res.status(401).json({ message: 'Unauthorized: Token expired' });
   } else {
     res.status(401).json({ message: 'Unauthorized: Invalid token' });
   }
 }
};
module.exports = authMiddleware;