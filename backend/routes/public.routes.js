// routes/public.routes.js
const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

// جلب قائمة الحلاقين (اسم ومعرّف فقط)
router.get('/barbers', async (req, res) => {
  try {
    const barbers = await Barber.find({}, 'name photo');
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الحلاقين' });
  }
});

// جلب قائمة الخدمات (اسم وسعر فقط)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({}, 'name price duration');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الخدمات' });
  }
});

// جلب جدول العمل والإجازات لحلاق محدد
router.get('/barbers/:id/availability', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ message: 'الحلاق غير موجود' });

    res.json({  
      workSchedule: barber.workSchedule,
      vacations: barber.vacations
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب التوفر' });
  }
});

// جلب الأوقات المحجوزة لحلاق في يوم معين
router.get('/appointments/booked', async (req, res) => {
  const { barberId, date } = req.query;

  if (!barberId || !date) {
    return res.status(400).json({ message: 'يرجى تحديد الحلاق والتاريخ' });
  }

  try {
    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(barberId)) {
      return res.status(400).json({ message: 'معرف الحلاق غير صالح' });
    }

    const appointments = await Appointment.find({ barberId, date });
    const bookedTimes = appointments.map(appt => appt.time);
    res.json({ bookedTimes });
  } catch (err) {
    console.error('❌ Error fetching booked times:', err.message);
    res.status(500).json({ message: 'حدث خطأ في جلب الأوقات المحجوزة' });
  }
});

// ✅ التحقق من وجود حجز مسبق بنفس رقم الهاتف
router.get('/appointments/check', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ message: 'رقم الهاتف مطلوب' });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const existing = await Appointment.findOne({
      phone,
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    });

    res.json({ exists: !!existing });
  } catch (err) {
    console.error('❌ Error checking existing booking:', err.message);
    res.status(500).json({ message: 'حدث خطأ في التحقق من الحجز' });
  }
});

module.exports = router;
