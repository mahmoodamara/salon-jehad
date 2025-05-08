// controllers/appointmentController.js
const moment = require("moment");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Barber = require("../models/Barber");
const Service = require("../models/Service");
const { verifyOTP } = require("../utils/otpUtils");
const sendWhatsAppMessage = require("../utils/sendWhatsapp");

const adminPhone = process.env.ADMIN_WHATSAPP;

exports.bookAppointment = async (req, res) => {
    try {
      const { name, phone, barberId, serviceId, date, time } = req.body;
  
      // تحقق من الحقول المطلوبة
      if (!name || !phone || !barberId || !serviceId || !date || !time) {
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });
      }
  
      // تحقق من صحة رقم الهاتف
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "رقم الهاتف غير صالح" });
      }
  
      // تحقق من تنسيق التاريخ والوقت
      if (
        !moment(date, "YYYY-MM-DD", true).isValid() ||
        !moment(time, "HH:mm", true).isValid()
      ) {
        return res.status(400).json({ message: "تنسيق التاريخ أو الوقت غير صحيح" });
      }
  
      // منع الحجز في الماضي
      const now = moment();
      const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
      if (appointmentDateTime.isBefore(now)) {
        return res.status(400).json({ message: "لا يمكن الحجز في الماضي" });
      }
  
      // تحقق من صلاحية معرفات الحلاق والخدمة
      if (
        !mongoose.isValidObjectId(barberId) ||
        !mongoose.isValidObjectId(serviceId)
      ) {
        return res.status(400).json({ message: "معرف غير صالح" });
      }
  
      // التأكد من وجود الحلاق والخدمة
      const barber = await Barber.findById(barberId);
      const service = await Service.findById(serviceId);
      if (!barber || !service) {
        return res.status(404).json({ message: "لم يتم العثور على الحلاق أو الخدمة" });
      }
  
      // التحقق من الإجازات
      if (barber.vacations.includes(date)) {
        return res.status(400).json({ message: "الحلاق في إجازة في هذا التاريخ" });
      }
  
      // التحقق من ساعات العمل
      const dayOfWeek = moment(date).format("dddd");
      const schedule = barber.workSchedule.get(dayOfWeek);
      if (!schedule) {
        return res.status(400).json({ message: "الحلاق لا يعمل في هذا اليوم" });
      }
  
      const start = moment(schedule.startTime, "HH:mm");
      const end = moment(schedule.endTime, "HH:mm");
      const chosenTime = moment(time, "HH:mm");
      if (!chosenTime.isBetween(start, end, undefined, "[)")) {
        return res.status(400).json({ message: "الوقت خارج ساعات عمل الحلاق" });
      }
  
      // منع تكرار الحجز لنفس الوقت
      const existing = await Appointment.findOne({ barberId, date, time });
      if (existing) {
        return res.status(409).json({ message: "يوجد حجز آخر في هذا الوقت" });
      }
  
      // إنشاء الحجز
      const appointment = await Appointment.create({
        name,
        phone,
        barberId,
        serviceId,
        date,
        time,
      });
  
      // إرسال إشعار إلى الأدمن
      const message = `✅ *تم تأكيد الحجز!*
  
  👤 الاسم: ${name}  
  ✂️ الخدمة: ${service.name}  
  💈 الحلاق: ${barber.name}  
  📅 التاريخ: ${date}  
  🕒 الوقت: ${time}  
  
  📍 صالون جهاد يرحب بك!`;
  
      await sendWhatsAppMessage(adminPhone, message).catch(console.error);
  
      res.status(201).json({ message: "تم إنشاء الحجز بنجاح", appointment });
  
    } catch (err) {
      console.error("Booking error:", err.message);
      res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحجز" });
    }
  };


  exports.bookGroupAppointment = async (req, res) => {
    try {
      const { name, phone, bookings } = req.body;
  
      if (!name || !phone || !Array.isArray(bookings) || bookings.length === 0 || bookings.length > 3) {
        return res.status(400).json({ message: "الرجاء إدخال الاسم ورقم الهاتف و1-3 حجوزات صحيحة" });
      }
  
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "رقم الهاتف غير صالح" });
      }
  
      const confirmedAppointments = [];
  
      for (const [i, booking] of bookings.entries()) {
        const { barberId, serviceId, date, time } = booking;
  
        if (!barberId || !serviceId || !date || !time) {
          return res.status(400).json({ message: `تفاصيل الحجز رقم ${i + 1} غير مكتملة` });
        }
  
        if (
          !moment(date, "YYYY-MM-DD", true).isValid() ||
          !moment(time, "HH:mm", true).isValid()
        ) {
          return res.status(400).json({ message: `تاريخ أو وقت غير صالح في الحجز رقم ${i + 1}` });
        }
  
        const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
        if (appointmentDateTime.isBefore(moment())) {
          return res.status(400).json({ message: `لا يمكن الحجز في الماضي (الحجز رقم ${i + 1})` });
        }
  
        if (!mongoose.isValidObjectId(barberId) || !mongoose.isValidObjectId(serviceId)) {
          return res.status(400).json({ message: `معرفات غير صالحة في الحجز رقم ${i + 1}` });
        }
  
        const barber = await Barber.findById(barberId);
        const service = await Service.findById(serviceId);
        if (!barber || !service) {
          return res.status(404).json({ message: `لم يتم العثور على الحلاق أو الخدمة في الحجز رقم ${i + 1}` });
        }
  
        if (barber.vacations.includes(date)) {
          return res.status(400).json({ message: `الحلاق في إجازة في ${date} (الحجز رقم ${i + 1})` });
        }
  
        const dayOfWeek = moment(date).format("dddd");
        const schedule = barber.workSchedule.get(dayOfWeek);
        if (!schedule) {
          return res.status(400).json({ message: `الحلاق لا يعمل في هذا اليوم (الحجز رقم ${i + 1})` });
        }
  
        const start = moment(schedule.startTime, "HH:mm");
        const end = moment(schedule.endTime, "HH:mm");
        const chosenTime = moment(time, "HH:mm");
  
        if (!chosenTime.isBetween(start, end, undefined, "[)")) {
          return res.status(400).json({ message: `الوقت خارج ساعات عمل الحلاق (الحجز رقم ${i + 1})` });
        }
  
        const existing = await Appointment.findOne({ barberId, date, time });
        if (existing) {
          return res.status(409).json({ message: `يوجد حجز آخر في هذا الوقت (الحجز رقم ${i + 1})` });
        }
  
        const appointment = await Appointment.create({
          name,
          phone,
          barberId,
          serviceId,
          date,
          time
        });
  
        confirmedAppointments.push(appointment);
  
        // إرسال إشعار للأدمن
        const message = `✅ *تم تأكيد الحجز (${i + 1})!*
  
  👤 الاسم: ${name}
  ✂️ الخدمة: ${service.name}
  💈 الحلاق: ${barber.name}
  📅 التاريخ: ${date}
  🕒 الوقت: ${time}
  
  📍 صالون جهاد يرحب بك!`;
  
        await sendWhatsAppMessage(adminPhone, message).catch(console.error);
      }
  
      return res.status(201).json({ message: "تم تأكيد جميع الحجوزات بنجاح", appointments: confirmedAppointments });
  
    } catch (err) {
      console.error("Group booking error:", err.message);
      return res.status(500).json({ message: "حدث خطأ أثناء الحجز الجماعي" });
    }
  };

  exports.getClosestBarbers = async (req, res) => {
    try {
      const { selectedBarberId, date, time } = req.query;
  
      if (!selectedBarberId || !date || !time) {
        return res.status(400).json({ message: "يرجى إدخال معرف الحلاق، التاريخ، والوقت" });
      }
  
      const allBarbers = await Barber.find({ _id: { $ne: selectedBarberId } });
  
      const selectedTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
  
      const barbersWithClosestTimes = [];
  
      for (const barber of allBarbers) {
        if (barber.vacations.includes(date)) continue;
  
        const dayOfWeek = moment(date).format("dddd");
        const schedule = barber.workSchedule.get(dayOfWeek);
        if (!schedule) continue;
  
        const start = moment(schedule.startTime, "HH:mm");
        const end = moment(schedule.endTime, "HH:mm");
  
        const allSlots = [];
        const stepMinutes = 15;
  
        for (let m = moment(start); m.isBefore(end); m.add(stepMinutes, "minutes")) {
          const timeStr = m.format("HH:mm");
          const existing = await Appointment.findOne({
            barberId: barber._id,
            date,
            time: timeStr,
          });
  
          if (!existing) {
            allSlots.push({
              time: timeStr,
              diffMinutes: Math.abs(m.diff(selectedTime, "minutes")),
            });
          }
        }
  
        if (allSlots.length > 0) {
          allSlots.sort((a, b) => a.diffMinutes - b.diffMinutes);
          barbersWithClosestTimes.push({
            barberId: barber._id,
            barberName: barber.name,
            closestTime: allSlots[0].time,
            timeDifference: allSlots[0].diffMinutes,
          });
        }
      }
  
      barbersWithClosestTimes.sort((a, b) => a.timeDifference - b.timeDifference);
      res.json(barbersWithClosestTimes);
  
    } catch (err) {
      console.error("Closest barbers error:", err.message);
      res.status(500).json({ message: "حدث خطأ أثناء البحث عن الحلاقين" });
    }
  };
  
  
exports.getAppointmentsByPhone = async (req, res) => {
  const { phone } = req.params;
  const phoneRegex = /^05\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "رقم الهاتف غير صالح" });
  }

  try {
    const appointments = await Appointment.find({ phone })
      .populate("barberId", "name")
      .populate("serviceId", "name price")
      .sort({ date: -1, time: -1 });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Get appointments error:", err.message);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الحجوزات" });
  }
};
exports.cancelAppointment = async (req, res) => {
    const { phone, otp } = req.body;
    const { id } = req.params;
  
    if (!phone || !otp) {
      return res.status(400).json({ message: "الهاتف ورمز التحقق مطلوبان" });
    }
  
    try {
      // التحقق من صحة رمز OTP
      const otpValid = verifyOTP(phone, otp);
      if (!otpValid) {
        return res.status(400).json({ message: "رمز التحقق غير صالح أو منتهي" });
      }
  
      // البحث عن الحجز
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: "لم يتم العثور على الحجز" });
      }
  
      if (appointment.phone !== phone) {
        return res.status(403).json({ message: "رقم الهاتف لا يطابق الحجز" });
      }
  
      // حذف الحجز نهائياً
      await Appointment.findByIdAndDelete(id);
  
      // إرسال إشعار واتساب
      const msg = `⚠️ *تم حذف حجزك نهائيًا*
  
  📅 *التاريخ:* ${appointment.date}
  🕒 *الوقت:* ${appointment.time}
  
  نرحب بك دائمًا، ويمكنك الحجز مرة أخرى من خلال الموقع.`;
      await sendWhatsAppMessage(phone, msg);
  
      res.status(200).json({ message: "تم حذف الحجز بنجاح" });
    } catch (err) {
      console.error("Cancel error:", err.message);
      res.status(500).json({ message: "حدث خطأ أثناء حذف الحجز" });
    }
  };
  
exports.rescheduleAppointment = async (req, res) => {
  const { phone, otp, date, time } = req.body;
  const { id } = req.params;

  if (!phone || !otp || !date || !time) {
    return res.status(400).json({ message: "كل الحقول مطلوبة" });
  }

  try {
    const otpValid = verifyOTP(phone, otp);
    if (!otpValid) {
      return res.status(400).json({ message: "رمز التحقق غير صالح أو منتهي" });
    }

    const appointment = await Appointment.findById(id)
      .populate("barberId")
      .populate("serviceId");

    if (!appointment || appointment.phone !== phone) {
      return res
        .status(404)
        .json({ message: "الحجز غير موجود أو الهاتف لا يطابق" });
    }

    const barber = appointment.barberId;
    const now = moment();
    const newDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");

    if (!newDateTime.isValid() || newDateTime.isBefore(now)) {
      return res.status(400).json({ message: "تاريخ أو وقت غير صالح" });
    }

    if (barber.vacations.includes(date)) {
      return res
        .status(400)
        .json({ message: "الحلاق في إجازة في هذا التاريخ" });
    }

    const dayOfWeek = moment(date).format("dddd");
    const schedule = barber.workSchedule.get(dayOfWeek);
    if (!schedule) {
      return res.status(400).json({ message: "الحلاق لا يعمل في هذا اليوم" });
    }

    const chosenTime = moment(time, "HH:mm");
    const start = moment(schedule.startTime, "HH:mm");
    const end = moment(schedule.endTime, "HH:mm");
    if (!chosenTime.isBetween(start, end, undefined, "[)")) {
      return res.status(400).json({ message: "الوقت خارج ساعات العمل" });
    }

    const existing = await Appointment.findOne({
      barberId: barber._id,
      date,
      time,
      _id: { $ne: appointment._id },
    });
    if (existing) {
      return res.status(409).json({ message: "يوجد حجز آخر في هذا الوقت" });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = "pending";
    await appointment.save();

    await sendWhatsAppMessage(
      phone,
      `📅 *تم تعديل حجزك بنجاح!*

🔄 تم تغيير الموعد إلى:
📅 *${date}*   🕒 *${time}*

✂️ *الخدمة:* ${appointment.serviceId.name}
💈 *الحلاق:* ${appointment.barberId.name}`
    );

    res.status(200).json({ message: "تم تعديل الحجز بنجاح", appointment });
  } catch (err) {
    console.error("Reschedule error:", err.message);
    res.status(500).json({ message: "حدث خطأ أثناء تعديل الحجز" });
  }
};



exports.confirmAppointmentStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, phone, otp } = req.body;
  
      if (!['confirmed', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'الحالة غير صالحة' });
      }
  
      if (!phone || !otp) {
        return res.status(400).json({ message: 'رقم الهاتف ورمز التحقق مطلوبان' });
      }
  
      const otpValid = verifyOTP(phone, otp);
      if (!otpValid) {
        return res.status(400).json({ message: 'رمز التحقق غير صالح أو منتهي' });
      }
  
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'الحجز غير موجود' });
      }
  
      if (appointment.phone !== phone) {
        return res.status(403).json({ message: 'رقم الهاتف لا يطابق هذا الحجز' });
      }
  
      appointment.status = status;
      appointment.confirmationRequested = false;
      appointment.lastConfirmationRequestAt = null;
      await appointment.save();
  
      res.status(200).json({ message: 'تم تأكيد حالة الحجز بنجاح', appointment });
    } catch (err) {
      console.error("Error in confirmAppointmentStatus:", err.message);
      res.status(500).json({ message: 'حدث خطأ أثناء تأكيد الموعد' });
    }
  };
  