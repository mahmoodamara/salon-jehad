// utils/sendWhatsapp.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Twilio environment variables are missing. Please check your .env file.");
}

const client = twilio(accountSid, authToken);

/**
 * Converts local Israeli phone number to E.164 format.
 * Example: 0545828034 → +972545828034
 */
function formatToE164(phone) {
  if (!phone || typeof phone !== 'string') {
    console.error('📛 رقم الهاتف غير معرف أو غير صالح:', phone);
    return null;
  }

  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '+972' + cleaned.slice(1);
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

/**
 * Sends a WhatsApp message using Twilio.
 * @param {string} phone - Local or international phone number
 * @param {string} message - Text message to send
 */
async function sendWhatsAppMessage(phone, message) {
    try {
      const formattedPhone = formatToE164(phone);
  
      if (!formattedPhone || !/^\+?[1-9]\d{6,14}$/.test(formattedPhone)) {
        throw new Error(`Invalid phone number format. Provided: ${phone}, converted: ${formattedPhone}`);
      }
  
      const response = await client.messages.create({
        from: fromNumber,
        to: `whatsapp:${formattedPhone}`,
        body: message
      });
  
      console.log(`✅ WhatsApp message sent successfully to ${formattedPhone} (SID: ${response.sid})`);
      return response;
    } catch (error) {
      console.error("❌ WhatsApp message sending failed:", error.message);
      return null;
    }
  }
  

module.exports = sendWhatsAppMessage;