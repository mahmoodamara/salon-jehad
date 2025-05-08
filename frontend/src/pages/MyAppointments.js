import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
  const [verified, setVerified] = useState(!!localStorage.getItem('userPhone'));

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/appointments/phone/${phone}`);
      setAppointments(res.data.appointments);
    } catch (err) {
      Swal.fire('خطأ', err.response?.data?.message || 'فشل في جلب الحجوزات', 'error');
    } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    if (verified) {
      fetchAppointments();
    }
  }, [verified, fetchAppointments]);

  const handlePhoneSubmit = async () => {
    if (!/^05\d{8}$/.test(phone)) {
      return Swal.fire('تنبيه', 'يرجى إدخال رقم هاتف صحيح يبدأ بـ 05', 'warning');
    }
  
    try {
      await axios.post(`${API}/verify/send`, { phone });
  
      const { value: otp } = await Swal.fire({
        title: '🔐 رمز التحقق',
        html: `
          <p class="text-yellow-300 text-base mb-4">📲 أدخل رمز التحقق المكوّن من 4 أرقام:</p>
          <div id="otp-container" class="flex justify-center gap-2" dir="ltr">
            ${[0, 1, 2, 3].map(i => `
              <input type="text" inputmode="numeric" maxlength="1"
                class="otp-input w-12 h-12 md:w-14 md:h-14 text-center text-2xl rounded-lg bg-white text-black shadow-md focus:outline-none"
                id="otp-${i}" />
            `).join('')}
          </div>
        `,
        background: '#111827',
        color: '#facc15',
        showCancelButton: true,
        confirmButtonText: '✔️ تأكيد',
        cancelButtonText: '❌ إلغاء',
        customClass: {
          popup: 'rounded-2xl shadow-xl px-4 pt-6 pb-4',
          title: 'text-xl font-bold text-yellow-400',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-black text-sm px-4 py-2 rounded mt-4',
          cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded mt-4',
        },
        buttonsStyling: false,
        didOpen: () => {
          const inputs = Array.from(document.querySelectorAll('.otp-input'));
          inputs[0].focus();
          inputs.forEach((input, i) => {
            input.style.direction = 'ltr';
            input.addEventListener('input', () => {
              input.value = input.value.replace(/\D/, '');
              if (input.value && i < 3) inputs[i + 1].focus();
            });
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace' && !input.value && i > 0) {
                inputs[i - 1].focus();
              }
            });
          });
        },
        preConfirm: () => {
          const digits = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
          if (!/^\d{4}$/.test(digits)) {
            Swal.showValidationMessage('❗ الرجاء إدخال 4 أرقام');
          }
          return digits;
        }
      });
  
      if (!otp) return;
  
      const verifyRes = await axios.post(`${API}/verify/confirm`, { phone, otp });
  
      if (verifyRes.data.verified) {
        localStorage.setItem('userPhone', phone);
  
        await Swal.fire({
          icon: 'success',
          title: '✅ تم التحقق',
          text: 'تم التحقق من رقم الهاتف بنجاح',
          background: '#1f2937',
          color: '#facc15',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'rounded-xl shadow-2xl px-6 py-4',
            icon: 'text-yellow-400 border-yellow-400',
            title: 'text-2xl font-extrabold text-yellow-400',
            content: 'text-yellow-300 text-md',
          },
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) popup.style.fontFamily = 'Cairo, sans-serif';
          }
        });
  
        setVerified(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'رمز التحقق غير صحيح',
          background: '#1f2937',
          color: '#f87171',
          confirmButtonText: 'حسنًا',
          customClass: {
            popup: 'rounded-xl shadow-xl',
            title: 'text-xl font-bold text-red-400',
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded',
          },
          buttonsStyling: false,
        });
      }
    } catch (err) {
      Swal.fire(
        'خطأ',
        err.response?.data?.message || 'فشل في إرسال أو التحقق من الرمز',
        'error'
      );
    }
  };
  

  const handleCancel = async (appointment) => {
    try {
      await axios.post(`${API}/verify/send`, { phone });
  
      const { value: otp } = await Swal.fire({
        title: '❗ تأكيد الإلغاء',
        html: `<p class="text-yellow-300 mb-2">تم إرسال رمز تحقق إلى WhatsApp.<br/>الرجاء إدخاله أدناه:</p>`,
        input: 'text',
        inputPlaceholder: 'رمز التحقق',
        background: '#1f2937', // bg-gray-800
        color: '#facc15',       // text-yellow-400
        showCancelButton: true,
        confirmButtonText: '❌ تأكيد الإلغاء',
        cancelButtonText: '🔙 إلغاء',
        customClass: {
          popup: 'rounded-xl shadow-lg px-4 pt-6 pb-4',
          title: 'text-xl font-bold text-yellow-400',
          input: 'text-black rounded p-2',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded mx-2',
          cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded mx-2',
        },
        buttonsStyling: false,
      });
  
      if (!otp) return;
  
      await axios.patch(`${API}/appointments/${appointment._id}/cancel`, {
        phone,
        otp,
      });
  
      await Swal.fire({
        icon: 'success',
        title: '✅ تم الإلغاء',
        text: 'تم إلغاء الحجز بنجاح',
        background: '#1f2937',
        color: '#facc15',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-xl shadow-xl px-6 py-4',
          title: 'text-yellow-400 font-bold text-xl',
        }
      });
  
      fetchAppointments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'حدث خطأ',
        text: err.response?.data?.message || 'فشل في إلغاء الحجز',
        background: '#1f2937',
        color: '#f87171',
        confirmButtonText: 'موافق',
        customClass: {
          popup: 'rounded-xl shadow-xl',
          title: 'text-red-400 font-bold text-xl',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded',
        },
        buttonsStyling: false,
      });
    }
  
  
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative">
      <Link
        to="/"
        className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 text-2xl"
        title="عودة إلى الصفحة الرئيسية"
      >
        ←
      </Link>

      <div className="w-full max-w-3xl space-y-8 bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-400">📅 استعراض حجوزاتك</h1>

        {!verified && (
          <div className="space-y-4">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم هاتفك (يبدأ بـ 05)"
              className="w-full p-3 rounded text-black"
            />
            <button
              onClick={handlePhoneSubmit}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded"
            >
              إرسال رمز التحقق
            </button>
          </div>
        )}

        {verified && loading && <p className="text-center">⏳ جاري التحميل...</p>}

        {verified && !loading && appointments.length === 0 && (
          <p className="text-center text-gray-400">لا توجد حجوزات حالياً</p>
        )}

        {verified && !loading && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-gray-700 p-4 rounded-lg shadow space-y-2 text-right">
                <h3 className="text-lg font-semibold text-yellow-300">
                  {appt.serviceId?.name} لدى {appt.barberId?.name}
                </h3>
                <p>📅 التاريخ: {moment(appt.date).format('YYYY-MM-DD')}</p>
                <p>🕐 الوقت: {appt.time}</p>
                <p>🔧 الحالة: <span className="font-bold">{appt.status}</span></p>

                {appt.status !== 'cancelled' && (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleCancel(appt)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
