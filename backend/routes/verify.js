// routes/verify.js
const express = require('express');
const router = express.Router();
const {
  generateOTP,
  saveOTP,
  isRateLimited,
  markOTPSent,
  verifyOTP
} = require('../utils/otpUtils');
const sendWhatsAppMessage = require('../utils/sendWhatsapp');

router.post('/send', async (req, res) => {
  const { phone } = req.body;
  const phoneRegex = /^05\d{8}$/;

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'رقم هاتف غير صالح (مثال: 05xxxxxxxx)' });
  }

  if (isRateLimited(phone)) {
    return res.status(429).json({ message: 'يرجى الانتظار دقيقة قبل طلب رمز جديد' });
  }

  const code = generateOTP();
  saveOTP(phone, code);
  markOTPSent(phone);

  try {
    console.log(code)
    await sendWhatsAppMessage(phone, `رمز التحقق الخاص بك هو: ${code}`);
    res.status(200).json({ message: 'تم إرسال رمز التحقق عبر واتساب' });
  } catch (err) {
    console.error('WhatsApp error:', err.message);
    res.status(500).json({ message: 'فشل في إرسال الرسالة' });
  }
});

router.post('/confirm', (req, res) => {
    const { phone, otp } = req.body;
  
    if (!phone || !otp) {
      return res.status(400).json({ message: 'الرجاء إدخال رقم الهاتف ورمز التحقق' });
    }
  
    const valid = verifyOTP(phone, otp);
    if (!valid) {
      return res.status(401).json({ message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' });
    }
  
    return res.status(200).json({ message: 'تم التحقق من الرمز بنجاح', verified: true });
  });

module.exports = router;
