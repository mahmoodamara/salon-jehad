const moment = require("moment");
const Appointment = require("../models/Appointment");
const sendWhatsAppMessage = require("../utils/sendWhatsapp");

const checkAppointmentsForConfirmation = async () => {
  try {
    const now = moment();

    const todayAppointments = await Appointment.find({
      status: "pending",
      date: moment().format("YYYY-MM-DD"),
    });

    for (const appointment of todayAppointments) {
      const appointmentTime = moment(`${appointment.date} ${appointment.time}`, "YYYY-MM-DD HH:mm");
      const minutesUntilAppointment = appointmentTime.diff(now, "minutes");

      // 1. تذكير قبل ساعة مع رابط mode=before
      if (
        !appointment.reminderSent &&
        minutesUntilAppointment <= 60 &&
        minutesUntilAppointment >= 59
      ) {
        const reminderMsg = `📢 *تذكير بالموعد!*

👤 ${appointment.name}
📅 ${appointment.date}
🕒 ${appointment.time}

📍 نراك قريبًا في *صالون جهاد* 💈

يرجى تأكيد ما إذا كنت ستحضر الموعد من خلال الرابط التالي:
🔗 https://your-domain.com/confirm-appointment/${appointment._id}?mode=before`;

        await sendWhatsAppMessage(appointment.phone, reminderMsg);
        appointment.reminderSent = true;
        await appointment.save();
      }

      // 2. بعد 30 دقيقة من الموعد – تأكيد فعلي
      if (
        !appointment.confirmationRequested &&
        now.diff(appointmentTime, "minutes") >= 30
      ) {
        const confirmationMsg = `🕒 *هل تم حضور الموعد؟*

👤 *${appointment.name}*
📅 *${appointment.date}*
🕒 *${appointment.time}*

يرجى تأكيد الحضور من الرابط التالي:
🔗 https://your-domain.com/confirm-appointment/${appointment._id}`;

        await sendWhatsAppMessage(appointment.phone, confirmationMsg);
        appointment.confirmationRequested = true;
        appointment.lastConfirmationRequestAt = now.toDate();
        await appointment.save();
      }
    }
  } catch (error) {
    console.error("Error in checkAppointmentsForConfirmation:", error.message);
  }
};

module.exports = checkAppointmentsForConfirmation;
