import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

const ConfirmAppointmentPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ دالة fetchAppointment مغلفة بـ useCallback لتجنب إعادة تعريفها
  const fetchAppointment = useCallback(
    async (overridePhone) => {
      const targetPhone = overridePhone || phone;

      if (!/^05\d{8}$/.test(targetPhone)) {
        return Swal.fire({
          icon: "warning",
          title: "تحذير",
          text: "رقم الهاتف غير صالح",
          background: "#1f2937",
          color: "#facc15",
          confirmButtonText: "حسنًا",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-yellow-400 font-bold text-xl",
            confirmButton:
              "bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded",
          },
          buttonsStyling: false,
        });
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${API}/appointments/phone/${targetPhone}`
        );
        const data = response.data;
        if (data.appointments?.length > 0) {
          setAppointment(data.appointments[0]);
          localStorage.setItem("userPhone", targetPhone);
        } else {
          Swal.fire({
            icon: "info",
            title: "ملاحظة",
            text: "لا يوجد حجز مرتبط بهذا الرقم",
            background: "#1f2937",
            color: "#facc15",
            confirmButtonText: "فهمت",
            customClass: {
              popup: "rounded-xl shadow-lg",
              title: "text-yellow-400 font-bold text-xl",
              confirmButton:
                "bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded",
            },
            buttonsStyling: false,
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "فشل الاتصال بالخادم",
          background: "#1f2937",
          color: "#f87171",
          confirmButtonText: "موافق",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-red-400 font-bold text-xl",
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
          },
          buttonsStyling: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [phone]
  );

  // ✅ useEffect يستدعي fetchAppointment إذا كان الهاتف محفوظًا مسبقًا
  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    if (storedPhone && !appointment) {
      setPhone(storedPhone);
      fetchAppointment(storedPhone);
    }
  }, [appointment, fetchAppointment]);

  const handleConfirmation = async () => {
    if (!appointment) return;

    const storedPhone = localStorage.getItem("userPhone");
    if (!storedPhone) {
      return Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "رقم الهاتف غير موجود في التخزين المحلي",
        background: "#1f2937",
        color: "#f87171",
        confirmButtonText: "موافق",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-red-400 font-bold text-xl",
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        },
        buttonsStyling: false,
      });
    }

    try {
      await axios.post(`${API}/verify/send`, { phone: storedPhone });

      const { value: otp } = await Swal.fire({
        title: "تأكيد الحضور",
        text: "تم إرسال رمز تحقق إلى WhatsApp. الرجاء إدخاله لتأكيد الحضور:",
        input: "text",
        inputPlaceholder: "رمز التحقق",
        background: "#111827",
        color: "#facc15",
        showCancelButton: true,
        confirmButtonText: "✔️ تأكيد",
        cancelButtonText: "❌ إلغاء",
        customClass: {
          popup: "rounded-xl shadow-xl px-4 pt-6 pb-4",
          title: "text-xl font-bold text-yellow-400",
          input: "text-black text-center text-xl rounded p-2",
          confirmButton:
            "bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded mx-2",
          cancelButton:
            "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mx-2",
        },
        buttonsStyling: false,
      });

      if (!otp) return;

      const now = new Date();
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
      );
      const status = now > appointmentDateTime ? "completed" : "confirmed";

      await axios.post(
        `${API}/appointments/confirm-appointment/${appointment._id}`,
        {
          status,
          phone: storedPhone,
          otp,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "تم التأكيد",
        text:
          status === "completed"
            ? "تم تأكيد الحضور."
            : "تم تسجيل نيتك بالحضور.",
        background: "#1f2937",
        color: "#facc15",
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: "rounded-xl shadow-2xl px-6 py-4",
          icon: "text-yellow-400 border-yellow-400",
          title: "text-2xl font-extrabold text-yellow-400",
          content: "text-yellow-300 text-md",
        },
        didClose: () => navigate("/"),
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: err.response?.data?.message || "فشل أثناء التأكيد",
        background: "#1f2937",
        color: "#f87171",
        confirmButtonText: "موافق",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-red-400 font-bold text-xl",
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        },
        buttonsStyling: false,
      });
    }
  };

  const handleCancel = async () => {
    const storedPhone = localStorage.getItem("userPhone");
    if (!storedPhone) {
      return Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "رقم الهاتف غير موجود في التخزين المحلي",
        background: "#1f2937",
        color: "#f87171",
        confirmButtonText: "موافق",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-red-400 font-bold text-xl",
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        },
        buttonsStyling: false,
      });
    }

    try {
      await axios.post(`${API}/verify/send`, { phone: storedPhone });

      const { value: otp } = await Swal.fire({
        title: "تأكيد الإلغاء",
        text: "تم إرسال رمز تحقق إلى WhatsApp. الرجاء إدخاله أدناه:",
        input: "text",
        inputPlaceholder: "رمز التحقق",
        background: "#111827",
        color: "#facc15",
        showCancelButton: true,
        confirmButtonText: "✔️ تأكيد الإلغاء",
        cancelButtonText: "❌ إلغاء",
        customClass: {
          popup: "rounded-xl shadow-xl px-4 pt-6 pb-4",
          title: "text-xl font-bold text-yellow-400",
          input: "text-black text-center text-xl rounded p-2",
          confirmButton:
            "bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded mx-2",
          cancelButton:
            "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mx-2",
        },
        buttonsStyling: false,
      });

      if (!otp) return;

      await axios.patch(`${API}/appointments/${appointment._id}/cancel`, {
        phone: storedPhone,
        otp,
      });

      await Swal.fire({
        title: "تم",
        text: "تم إلغاء الحجز بنجاح",
        icon: "success",
        background: "#1f2937",
        color: "#facc15",
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: "rounded-xl shadow-2xl px-6 py-4",
          icon: "text-yellow-400 border-yellow-400",
          title: "text-2xl font-extrabold text-yellow-400",
          content: "text-yellow-300 text-md",
        },
        didClose: () => navigate("/"),
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: err.response?.data?.message || "فشل في إلغاء الحجز",
        background: "#1f2937",
        color: "#f87171",
        confirmButtonText: "موافق",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-red-400 font-bold text-xl",
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative"
    >
      {/* 🔙 سهم الرجوع أعلى يمين الصفحة */}
      <Link
        to="/"
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl"
        title="العودة إلى الصفحة الرئيسية"
      >
        ←
      </Link>

      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl shadow-lg text-right space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400 text-center">
          💈 تأكيد حضور الموعد
        </h1>

        {loading && <p className="text-center">⏳ جاري التحميل...</p>}

        {!appointment && (
          <>
            <p className="text-sm text-gray-300">أدخل رقم الهاتف لعرض الحجز:</p>
            <input
              type="text"
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded"
            />
            <button
              onClick={fetchAppointment}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full mt-3"
            >
              عرض الموعد
            </button>
          </>
        )}

        {appointment && (
          <>
            {(() => {
              const getArabicStatus = (status) => {
                switch (status) {
                  case "pending":
                    return "قيد الانتظار";
                  case "confirmed":
                    return "تم التأكيد";
                  case "completed":
                    return "تم الحضور";
                  case "cancelled":
                    return "تم الإلغاء";
                  default:
                    return "غير معروف";
                }
              };

              return (
                <>
                  {/* بطاقة بيانات المستخدم */}
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 text-black rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow">
                        <span role="img" aria-label="user">
                          👤
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-300">الاسم الكامل</p>
                        <p className="text-white text-lg font-semibold">
                          {appointment.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-300">رقم الهاتف</p>
                      <p className="text-white text-md">{phone}</p>
                    </div>
                  </div>

                  {/* بطاقة معلومات الموعد */}
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md text-sm space-y-2 mt-4">
                    <p>
                      📅 <span className="text-gray-300">التاريخ:</span>{" "}
                      {appointment.date}
                    </p>
                    <p>
                      🕐 <span className="text-gray-300">الوقت:</span>{" "}
                      {appointment.time}
                    </p>
                    <p>
                      📌 <span className="text-gray-300">الحالة الحالية:</span>{" "}
                      <span className="font-bold text-yellow-300">
                        {getArabicStatus(appointment.status)}
                      </span>
                    </p>
                  </div>

                  {/* الرسالة أو الأزرار حسب الحالة */}
                  {["completed", "cancelled"].includes(appointment.status) ? (
                    <p className="text-green-400 font-semibold text-center mt-4">
                      ✅ لا يمكن تعديل الموعد بعد اكتماله أو إلغائه.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3 mt-6">
                      {/* زر تأكيد الحضور يظهر فقط إذا كان الموعد قيد الانتظار */}
                      {appointment.status === "pending" && (
                        <button
                          onClick={handleConfirmation}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                        >
                          ✅ نعم، أؤكد الحضور
                        </button>
                      )}
                      {appointment.status === "confirmed" && (
                        <div className="bg-green-700 text-white text-center py-3 px-4 rounded-lg shadow mt-4">
                          ✅{" "}
                          <span className="font-bold text-lg">
                            تم تأكيد حضورك بنجاح
                          </span>
                          <br />
                          يمكنك إلغاء الموعد إذا تغيّرت خطتك.
                        </div>
                      )}

                      {/* زر الإلغاء متاح دائمًا ما دام الموعد غير مكتمل أو ملغى */}
                      <button
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
                      >
                        ❌ إلغاء الموعد عبر OTP
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmAppointmentPage;
