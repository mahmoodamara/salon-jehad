// utils/otpUtils.js
const otps = new Map(); // phone => { code, expiresAt }

function generateOTP(length = 4) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
}

function saveOTP(phone, code) {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 دقائق
  otps.set(phone, { code, expiresAt });
}

function verifyOTP(phone, code) {
  const data = otps.get(phone);
  if (!data) return false;
  const isValid = data.code === code && data.expiresAt > Date.now();
  if (isValid) otps.delete(phone); // يُستخدم مرة واحدة فقط
  return isValid;
}

function isRateLimited(phone) {
  const data = otps.get(phone);
  if (!data) return false;
  return Date.now() - (data.sentAt || 0) < 60 * 1000; // دقيقة واحدة
}

function markOTPSent(phone) {
  const existing = otps.get(phone);
  if (existing) existing.sentAt = Date.now();
}

module.exports = {
  generateOTP,
  saveOTP,
  verifyOTP,
  isRateLimited,
  markOTPSent,
};
