// models/Barber.js
const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: { type: Number, required: true }, // سنوات الخبرة
  photo :{ type: String},
  workSchedule: { // جدول العمل
    type: Map,
    of: {
      startTime: String, // HH:mm
      endTime: String    // HH:mm
    },
    default: {}
  },
  vacations: [{ type: String }] // تواريخ الإجازات بصيغة YYYY-MM-DD
}, {
  timestamps: true
});

module.exports = mongoose.model('Barber', barberSchema);
