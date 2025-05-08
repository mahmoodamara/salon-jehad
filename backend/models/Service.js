const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // بالدقائق
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
