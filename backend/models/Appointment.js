const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  confirmationRequested: {
    type: Boolean,
    default: false
  },
  lastConfirmationRequestAt: {
    type: Date
  }
}, {
  timestamps: true
});

// منع التداخل بالحجز لنفس الحلاق بنفس التاريخ والوقت
appointmentSchema.index({ barberId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
