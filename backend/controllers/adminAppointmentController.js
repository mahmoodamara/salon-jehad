// controllers/adminAppointmentController.js
const Appointment = require('../models/Appointment');
const sendWhatsAppMessage = require('../utils/sendWhatsapp');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('barberId', 'name')
      .populate('serviceId', 'name price')
      .sort({ date: -1, time: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Get Appointments Error:', err.message);
    res.status(500).json({ message: 'فشل في جلب الحجوزات' });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'حالة غير صالحة' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('barberId', 'name')
      .populate('serviceId', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    appointment.status = status;
    await appointment.save();

    // ✅ إرسال إشعار WhatsApp للمستخدم عند تأكيد أو إلغاء الحجز
    const userPhone = appointment.phone;
    const barberName = appointment.barberId.name;
    const serviceName = appointment.serviceId.name;
    const date = appointment.date;
    const time = appointment.time;

    if (status === 'confirmed') {
      await sendWhatsAppMessage(userPhone, `✅ تم تأكيد حجزك لخدمة "${serviceName}" يوم ${date} الساعة ${time} لدى ${barberName}.`);
    } else if (status === 'cancelled') {
      await sendWhatsAppMessage(userPhone, `❌ تم إلغاء حجزك لخدمة "${serviceName}" يوم ${date} الساعة ${time}.`);
    }

    res.status(200).json({ message: 'تم تحديث الحالة', appointment });
  } catch (err) {
    console.error('Update Status Error:', err.message);
    res.status(500).json({ message: 'فشل في تحديث الحالة' });
  }
};
