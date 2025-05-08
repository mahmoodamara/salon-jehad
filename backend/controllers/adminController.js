// controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول' });
  }
};
