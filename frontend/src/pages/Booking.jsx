import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    barber: '',
    date: '',
    time: '',
    name: '',
    phone: '',
  });

  const services = ['قص شعر', 'تهذيب لحية', 'حلاقة كاملة'];
  const barbers = ['أحمد', 'خالد', 'سامي'];
  const times = ['10:00 ص', '12:00 م', '2:00 م', '4:00 م', '6:00 م'];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // هنا يمكنك إرسال البيانات للسيرفر لاحقًا
    Swal.fire({
      icon: 'success',
      title: 'تم الحجز بنجاح!',
      text: `شكرًا ${formData.name}، تم حجز موعدك.`,
    });
    setStep(1);
    setFormData({
      service: '',
      barber: '',
      date: '',
      time: '',
      name: '',
      phone: '',
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">نموذج الحجز</h1>

      <div className="max-w-md mx-auto space-y-6 bg-gray-800 p-4 rounded-lg shadow">

        {step === 1 && (
          <div>
            <label className="block mb-2">اختر الخدمة</label>
            <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 rounded text-black">
              <option value="">-- اختر --</option>
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block mb-2">اختر الحلاق</label>
            <select name="barber" value={formData.barber} onChange={handleChange} className="w-full p-2 rounded text-black">
              <option value="">-- اختر --</option>
              {barbers.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">اختر التاريخ</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 rounded text-black" />
            </div>
            <div>
              <label className="block mb-2">اختر الوقت</label>
              <select name="time" value={formData.time} onChange={handleChange} className="w-full p-2 rounded text-black">
                <option value="">-- اختر --</option>
                {times.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">الاسم</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded text-black" />
            </div>
            <div>
              <label className="block mb-2">رقم الهاتف</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 rounded text-black" />
            </div>
          </div>
        )}

        {/* أزرار التنقل */}
        <div className="flex justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="bg-gray-600 px-4 py-2 rounded">رجوع</button>
          ) : <div></div>}

          {step < 4 ? (
            <button onClick={handleNext} disabled={!formData[step === 1 ? 'service' : step === 2 ? 'barber' : 'date']} className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-400">
              التالي
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!formData.name || !formData.phone} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              تأكيد الحجز
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
