import React from 'react';

const AdminPanel = () => {
  const bookings = [
    {
      id: 1,
      name: 'محمد',
      service: 'قص شعر',
      barber: 'أحمد',
      date: '2025-05-06',
      time: '2:00 م',
      phone: '0501234567',
    },
    {
      id: 2,
      name: 'خالد',
      service: 'حلاقة كاملة',
      barber: 'سامي',
      date: '2025-05-06',
      time: '4:00 م',
      phone: '0507654321',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 text-white p-4">
      <h1 className="text-2xl font-bold text-center text-gold mb-6">لوحة تحكم الإدارة</h1>

      {/* ✅ عرض كبطاقات على الموبايل */}
      <div className="space-y-4 sm:hidden">
        {bookings.map((b) => (
          <div key={b.id} className="bg-gray-900 p-4 rounded-lg shadow-md">
            <p><span className="text-gold font-bold">الاسم:</span> {b.name}</p>
            <p><span className="text-gold font-bold">الخدمة:</span> {b.service}</p>
            <p><span className="text-gold font-bold">الحلاق:</span> {b.barber}</p>
            <p><span className="text-gold font-bold">التاريخ:</span> {b.date}</p>
            <p><span className="text-gold font-bold">الوقت:</span> {b.time}</p>
            <p><span className="text-gold font-bold">الهاتف:</span> {b.phone}</p>
            <button className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">حذف</button>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-center text-gray-400">لا توجد حجوزات حالياً</p>
        )}
      </div>

      {/* ✅ جدول للحواسيب فقط */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gold text-center">
              <th className="p-3">الاسم</th>
              <th className="p-3">الخدمة</th>
              <th className="p-3">الحلاق</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">الوقت</th>
              <th className="p-3">الهاتف</th>
              <th className="p-3">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="text-center border-b border-gray-800 hover:bg-gray-800 transition">
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.service}</td>
                <td className="p-2">{b.barber}</td>
                <td className="p-2">{b.date}</td>
                <td className="p-2">{b.time}</td>
                <td className="p-2">{b.phone}</td>
                <td className="p-2">
                  <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
