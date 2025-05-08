import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";



const API = process.env.REACT_APP_API_URL;

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availability, setAvailability] = useState({
    workSchedule: {},
    vacations: [],
  });
  const [bookedTimes, setBookedTimes] = useState([]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpSentRef = useRef(false);
  const [otpVerified, setOtpVerified] = useState(false);




  const [form, setForm] = useState({
    name: "",
    phone: "",
    otp: "",
    barberId: "",
    serviceId: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberRes, serviceRes] = await Promise.all([
          axios.get(`${API}/public/barbers`),
          axios.get(`${API}/public/services`),
        ]);
        setBarbers(barberRes.data);
        setServices(serviceRes.data);
      } catch (err) {
        Swal.fire({
          title: "خطأ",
          text: "فشل في تحميل بيانات الحلاقين أو الخدمات",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedPhone = localStorage.getItem("userPhone");
  
    if (savedName && savedPhone && !otpSentRef.current) {
      otpSentRef.current = true; // 🔒 منع التكرار
  
      axios
        .get(`${API}/public/appointments/check?phone=${savedPhone}`)
        .then(async (res) => {
          if (res.data.exists) {
            Swal.fire({
              title: "تنبيه",
              text: "لديك حجز سابق لا يمكن إنشاء حجز جديد حالياً.",
              icon: "warning",
              confirmButtonText: "عرض حجوزاتي",
              customClass: {
                confirmButton:
                  "bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600",
              },
            }).then(() => {
              navigate("/MyAppointments");
            });
          } else {
            setForm((prev) => ({
              ...prev,
              name: savedName,
              phone: savedPhone,
            }));
            setStep(2);
  
            try {
              await axios.post(`${API}/verify/send`, { phone: savedPhone });
              setOtpTimer(60);
              Swal.fire({
                title: "تم الإرسال",
                text: "تم إرسال رمز التحقق إلى WhatsApp",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
              });
            } catch (err) {
              console.error("OTP Send Error:", err.message);
              Swal.fire({
                title: "خطأ",
                text: err.response?.data?.message || "فشل في إرسال رمز التحقق",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
              });
            }
          }
        })
        .catch((err) => {
          console.error("Error checking existing appointment:", err);
        });
    }
  }, [navigate]);
  
  

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!form.barberId) return;
      try {
        const res = await axios.get(
          `${API}/public/barbers/${form.barberId}/availability`
        );
        setAvailability(res.data);
        setAvailableDays(Object.keys(res.data.workSchedule));
      } catch {
        setAvailability({ workSchedule: {}, vacations: [] });
        setAvailableDays([]);
      }
    };
    fetchAvailability();
  }, [form.barberId]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!form.barberId || !form.date) return;
      try {
        const res = await axios.get(
          `${API}/public/appointments/booked?barberId=${form.barberId}&date=${form.date}`
        );
        setBookedTimes(res.data.bookedTimes || []);
      } catch {
        setBookedTimes([]);
      }
    };
    fetchBookedTimes();
  }, [form.barberId, form.date]);

  useEffect(() => {
    if (!form.date || !form.barberId || !availability.workSchedule) return;
    const dayName = moment(form.date).format("dddd");
    const daySchedule = availability.workSchedule[dayName];
    if (!daySchedule) return setAvailableTimes([]);

    const start = moment(daySchedule.startTime, "HH:mm");
    const end = moment(daySchedule.endTime, "HH:mm");
    const times = [];
    while (start.isBefore(end)) {
      const timeSlot = start.format("HH:mm");
      if (!bookedTimes.includes(timeSlot)) {
        times.push(timeSlot);
      }
      start.add(30, "minutes");
    }
    setAvailableTimes(times);
  }, [form.date, form.barberId, availability, bookedTimes]);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!form.phone || form.phone.length < 10) {
      Swal.fire({
        title: "تحقق من رقم الهاتف",
        text: "يرجى إدخال رقم هاتف صحيح",
        icon: "warning",
        confirmButtonText: "موافق",
        customClass: {
            confirmButton: "bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-200 shadow-md"
        }
      });
      return;
    }

    try {
      const checkRes = await axios.get(`${API}/public/appointments/check?phone=${form.phone}`);
      
      if (checkRes.data.exists) {
        Swal.fire({
          title: "ملاحظة",
          text: "لديك حجز سابق جارٍ أو مؤكد، لا يمكنك الحجز مرة أخرى.",
          icon: "warning",
          confirmButtonText: "موافق",
          customClass: {
            confirmButton: "bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-200 shadow-md"
        }
        });
        return;
      }

      await axios.post(`${API}/verify/send`, { phone: form.phone });

      Swal.fire({
        title: "تم الإرسال",
        text: "تم إرسال رمز التحقق إلى WhatsApp",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      setStep(2);
      setOtpTimer(60);
    } catch (err) {
      console.error("OTP Send Error:", err.message);
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء إرسال الرمز",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  const handleConfirmBooking = () => {
    const selectedBarber = barbers.find((b) => b._id === form.barberId);
    const selectedService = services.find((s) => s._id === form.serviceId);
  
    Swal.fire({
      title: '📋 تأكيد تفاصيل الحجز',
      html: `
        <div class="text-right leading-loose text-yellow-300 text-md">
          <p>👤 الاسم: <strong class="text-white">${form.name}</strong></p>
          <p>✂️ الحلاق: <strong class="text-white">${selectedBarber?.name}</strong></p>
          <p>🛠️ الخدمة: <strong class="text-white">${selectedService?.name}</strong></p>
          <p>📅 التاريخ: <strong class="text-white">${form.date}</strong></p>
          <p>🕐 الوقت: <strong class="text-white">${form.time}</strong></p>
        </div>
      `,
      icon: 'question',
      background: '#1f2937', // bg-gray-800
      color: '#facc15',       // text-yellow-400
      showCancelButton: true,
      confirmButtonText: '✅ نعم، تأكيد الحجز',
      cancelButtonText: '🔙 إلغاء',
      customClass: {
        popup: 'rounded-xl shadow-lg px-6 pt-6 pb-4',
        title: 'text-xl font-bold text-yellow-400',
        confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-black text-sm px-4 py-2 rounded mx-2',
        cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded mx-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        submitBooking();
      }
    });
  };
  

  const submitBooking = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/appointments/book`, form);
      Swal.fire({
        title: "نجاح",
        text: "تم حجز الموعد بنجاح",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
  
      // حفظ رقم الهاتف لاستخدامه في MyAppointments
      localStorage.setItem("userPhone", form.phone);
      localStorage.setItem("userName", form.name);

      // إعادة تعيين النموذج
      setForm({
        name: "",
        phone: "",
        otp: "",
        barberId: "",
        serviceId: "",
        date: "",
        time: "",
      });
      setStep(1);
  
      // ✅ الانتقال إلى صفحة الحجوزات
      navigate("/MyAppointments");
  
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "فشل في الحجز",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
         <Link
    to="/"
    className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl"
    title="عودة إلى الصفحة الرئيسية"
  >
    ←
  </Link>
      <div className="max-w-md w-full space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">نموذج الحجز</h1>
        {(step === 1 || step === 2) && (
  <div className="space-y-4">

    {/* الاسم ورقم الهاتف فقط في الخطوة الأولى */}
    {step === 1 && (
      <>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="الاسم"
          className="w-full p-2 rounded text-black"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="رقم الهاتف"
          className="w-full p-2 rounded text-black"
        />
        <button
          onClick={async () => {
            await sendOTP();
            setStep(2);
          }}
          disabled={!form.name || !form.phone || otpTimer > 0}
          className={`${
            otpTimer > 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          } text-black px-4 py-2 rounded w-full`}
        >
          {otpTimer > 0 ? `انتظر ${otpTimer} ثانية` : "إرسال رمز التحقق"}
        </button>
      </>
    )}

    {/* تحقق من الرمز إن لم يكن تم التحقق منه بعد */}
    {!otpVerified && step === 2 && (
      <>
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">
            أهلاً {form.name} 👋
          </h2>
          <p className="text-sm text-gray-300">
            أدخل رمز التحقق المرسل إلى رقمك:{" "}
            <span className="text-yellow-300">{form.phone}</span>
          </p>
        </div>

        <input
          type="text"
          name="otp"
          value={form.otp}
          onChange={handleChange}
          placeholder="رمز التحقق"
          className="w-full p-3 rounded text-black text-center tracking-widest font-bold text-lg"
          maxLength={6}
        />

        {otpTimer > 0 ? (
          <p className="text-yellow-300 text-sm text-center">
            يمكنك طلب رمز جديد بعد <strong>{otpTimer}</strong> ثانية
          </p>
        ) : (
          <div className="text-center">
            <button
              onClick={sendOTP}
              className="bg-transparent border border-blue-300 text-blue-300 px-4 py-1 rounded hover:bg-blue-300 hover:text-black transition text-sm"
            >
              إعادة إرسال رمز التحقق
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={async () => {
              try {
                const res = await axios.post(`${API}/verify/confirm`, {
                  phone: form.phone,
                  otp: form.otp,
                });
                if (res.data.verified) {
                  setOtpVerified(true);
                  Swal.fire({
                    icon: "success",
                    title: "تم التحقق",
                    text: "تم التحقق من رقمك بنجاح",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                  });
                } else {
                  throw new Error("رمز غير صالح");
                }
              } catch (err) {
                Swal.fire({
                  icon: "error",
                  title: "فشل التحقق",
                  text: "رمز التحقق غير صحيح أو منتهي",
                });
              }
            }}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            تحقق من الرمز
          </button>
        </div>
      </>
    )}

    {/* عرض الحقول بعد التحقق */}
    {otpVerified && (
      <>
        <select
          name="barberId"
          value={form.barberId}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        >
          <option value="">-- اختر الحلاق --</option>
          {barbers.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          name="serviceId"
          value={form.serviceId}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        >
          <option value="">-- اختر الخدمة --</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - ₪{s.price}
            </option>
          ))}
        </select>

        {availableDays.length > 0 && (
          <select
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          >
            <option value="">-- اختر اليوم --</option>
            {availableDays.flatMap((day) => {
              const nextDates = Array.from({ length: 14 }, (_, i) =>
                moment().add(i, "days")
              );
              return nextDates.map((d) => {
                const formattedDate = d.format("YYYY-MM-DD");
                const weekday = d.format("dddd");
                if (
                  weekday === day &&
                  !availability.vacations.includes(formattedDate)
                ) {
                  return (
                    <option key={formattedDate} value={formattedDate}>
                      {weekday} - {formattedDate}
                    </option>
                  );
                }
                return null;
              });
            })}
          </select>
        )}

        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
        >
          <option value="">-- اختر الوقت --</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setOtpVerified(false);
              setStep(1);
            }}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            رجوع
          </button>

          {loading ? (
            <div className="text-center py-2">
              <span className="animate-pulse">جارٍ تأكيد الحجز...</span>
            </div>
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={
                !form.barberId ||
                !form.serviceId ||
                !form.date ||
                !form.time
              }
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              تأكيد الحجز
            </button>
          )}
        </div>
      </>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default BookAppointment;
