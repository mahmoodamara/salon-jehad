// controllers/serviceController.js
const Service = require('../models/Service');

// إضافة خدمة
exports.createService = async (req, res) => {
  try {
    const { name, price, duration } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const service = await Service.create({ name, price, duration });
    res.status(201).json({ message: 'تمت إضافة الخدمة', service });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ', error: err.message });
  }
};

// عرض كل الخدمات
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الخدمات' });
  }
};

// تعديل خدمة
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'الخدمة غير موجودة' });
    res.status(200).json({ message: 'تم التعديل', service: updated });
  } catch (err) {
    res.status(500).json({ message: 'فشل في التعديل' });
  }
};

// حذف خدمة
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'الخدمة غير موجودة' });
    res.status(200).json({ message: 'تم حذف الخدمة' });
  } catch (err) {
    res.status(500).json({ message: 'فشل في الحذف' });
  }
};
