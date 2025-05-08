// middleware/adminAuth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'غير مصرح' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'لا تملك الصلاحيات' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'رمز الدخول غير صالح' });
  }
};
