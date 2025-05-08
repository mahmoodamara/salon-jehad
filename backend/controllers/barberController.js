// controllers/barberController.js
const Barber = require('../models/Barber');
const Appointment = require('../models/Appointment');

// إضافة حلاق
exports.createBarber = async (req, res) => {
  try {
    const { name, experience } = req.body;
    if (!name || !experience) return res.status(400).json({ message: 'الاسم والخبرة مطلوبة' });

    const barber = await Barber.create({ name, experience });
    res.status(201).json({ message: 'تمت إضافة الحلاق', barber });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ', error: err.message });
  }
};

// عرض جميع الحلاقين
exports.getBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.status(200).json(barbers);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الحلاقين' });
  }
};

// تعديل حلاق
exports.updateBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!barber) return res.status(404).json({ message: 'الحلاق غير موجود' });
    res.status(200).json({ message: 'تم التعديل', barber });
  } catch (err) {
    res.status(500).json({ message: 'فشل في التحديث' });
  }
};


exports.deleteBarber = async (req, res) => {
  try {
    const existingAppointments = await Appointment.findOne({ barberId: req.params.id });
    if (existingAppointments) {
      return res.status(400).json({ message: 'لا يمكن حذف الحلاق، لديه حجوزات حالية' });
    }

    const deleted = await Barber.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'الحلاق غير موجود' });

    res.status(200).json({ message: 'تم حذف الحلاق بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'فشل في حذف الحلاق' });
  }
};

// تحديث جدول العمل
exports.updateWorkSchedule = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) return res.status(404).json({ message: 'الحلاق غير موجود' });

    barber.workSchedule = req.body; // body = { Sunday: {startTime, endTime}, ... }
    await barber.save();

    res.status(200).json({ message: 'تم تحديث جدول العمل', schedule: barber.workSchedule });
  } catch (err) {
    res.status(500).json({ message: 'فشل في تحديث جدول العمل' });
  }
};

// إدارة الإجازات
exports.updateVacations = async (req, res) => {
  try {
    const { vacations } = req.body; // Array of dates
    const barber = await Barber.findByIdAndUpdate(
      req.params.id,
      { vacations },
      { new: true }
    );

    if (!barber) return res.status(404).json({ message: 'الحلاق غير موجود' });

    res.status(200).json({ message: 'تم تحديث الإجازات', vacations: barber.vacations });
  } catch (err) {
    res.status(500).json({ message: 'فشل في تحديث الإجازات' });
  }
};
