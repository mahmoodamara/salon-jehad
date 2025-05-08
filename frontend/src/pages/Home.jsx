import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdContentCut } from "react-icons/md";
import { GiBeard, GiRazor } from "react-icons/gi";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaWhatsapp,
  FaStar,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";

import image1 from "../assets/image 1.jpeg";
import image2 from "../assets/image 2.jpeg";
import image3 from "../assets/image 3.jpeg";
import image4 from "../assets/image 4.jpeg";
import image5 from "../assets/image6.png";
console.log("image5 path:", image5);
const API = process.env.REACT_APP_API_URL;
const getPhotoUrl = (fileName) =>
  fileName
    ? `http://localhost:5000/uploads/barbers/${fileName}`
    : "/default-barber.png";

const Home = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [barbers, setBarbers] = useState([]);

  const customerReviews = [
    { name: "محمود", comment: "خدمة ممتازة، شكراً لكم!" },
    { name: "بهاء", comment: "أفضل حلاقة حصلت عليها على الإطلاق." },
    { name: "محمد", comment: "الجو مريح وفريق العمل محترف جدًا." },
  ];

  const iconMap = {
    "حلاقة ذقن": <GiBeard className="text-3xl mx-auto mb-2 text-[#FFD700]" />,
    "قص شعر": <MdContentCut className="text-3xl mx-auto mb-2 text-[#FFD700]" />,
    "حلاقة كاملة": <GiRazor className="text-3xl mx-auto mb-2 text-[#FFD700]" />,
  };
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/public/services`);
      setServices(res.data);
    } catch (err) {
      console.error("فشل في جلب الخدمات:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/public/barbers`);
        console.log(res.data);
        setBarbers(res.data);
      } catch (err) {
        console.error("فشل في جلب الحلاقين:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div dir="rtl" className="bg-[#111827] text-white font-cairo min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-20 px-4 bg-[#1f2937] shadow-lg backdrop-blur bg-opacity-90">
        <h1 className="text-2xl font-bold text-[#FFD700]">صالون جهاد</h1>
        <a
          href="https://wa.me/972506540110"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white hover:text-[#FFD700] transition"
        >
          <FaWhatsapp className="text-xl" />
          واتساب
        </a>
      </nav>

      {/* أضف padding top مساوي لارتفاع الـ Navbar */}
      <div className="pt-20">
        <section
          className="relative h-[80vh] flex flex-col items-center justify-center text-center bg-cover bg-[center_top] animate-fadeIn px-4"
          style={{ backgroundImage: `url(${image5})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 flex flex-col items-center space-y-3 sm:hidden">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
              تصفيف احترافي بأسلوبك
            </h2>

            <button
              onClick={() => navigate("/booking")}
              className="bg-[#FFD700] text-black px-6 py-3 rounded-lg text-base hover:bg-yellow-400 transition font-bold shadow-md"
            >
              احجز الآن
            </button>

            <button
              onClick={() => navigate("/MyAppointments")}
              className="bg-transparent border border-[#FFD700] text-[#FFD700] px-6 py-3 rounded-lg text-base hover:bg-[#FFD700] hover:text-black transition font-bold shadow-md"
            >
              عرض حجوزاتي
            </button>
          </div>
        </section>

        {/* من نحن */}
        <section className="p-8 text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">من نحن</h3>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
            في صالون جهاد نقدم تجربة حلاقة متكاملة تمزج بين الأناقة والراحة...
          </p>
        </section>

        <section className="p-8 bg-gray-900 text-white">
          <h3
            className="text-2xl font-bold mb-8 text-center text-[#FFD700]"
            data-aos="zoom-in"
          >
            فريق الحلاقة لدينا
          </h3>

          {loading ? (
            <p className="text-center text-yellow-400">
              ⏳ جاري تحميل الحلاقين...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {barbers.map((barber) => (
                <div
                  key={barber._id}
                  className="bg-gray-800 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-transform duration-300 border border-gray-700"
                  data-aos="fade-up"
                >
                  <img
                    src={getPhotoUrl(barber.photo)}
                    alt={barber.name}
                    className="w-full h-64 object-contain bg-black border-2 border-yellow-400 shadow mb-4"
                  />

                  <h4 className="text-xl font-bold text-yellow-300">
                    {barber.name}
                  </h4>

                  {barber.bio && (
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {barber.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* خدماتنا */}
        <section className="p-8 bg-[#1f2937]">
          <h3
            className="text-2xl font-bold mb-6 text-center text-[#FFD700]"
            data-aos="zoom-in"
          >
            خدماتنا
          </h3>

          {loading ? (
            <p className="text-center text-yellow-400 text-lg animate-pulse">
              ⏳ جاري تحميل الخدمات...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-[#374151] p-6 rounded-xl shadow-lg text-center hover:scale-105 transition-transform border border-gray-600"
                  data-aos="fade-up"
                >
                  {iconMap[service.name] || (
                    <MdContentCut className="text-3xl mx-auto mb-2 text-[#FFD700]" />
                  )}
                  <p className="text-lg font-semibold text-white">
                    {service.name}
                  </p>
                  <p className="text-yellow-400 mt-1">💰 {service.price} ₪</p>
                  <p className="text-gray-400 text-sm">
                    ⏱️ {service.duration} دقيقة
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* آراء الزبائن */}
        <section className="p-8 bg-[#111827]" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-6 text-center text-[#FFD700]">
            آراء الزبائن
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {customerReviews.map((review, i) => (
              <div key={i} className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
                <p className="text-lg italic text-gray-300 mb-2">
                  "{review.comment}"
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[#FFD700] font-medium">
                    - {review.name}
                  </p>
                  <div className="flex gap-1 text-[#FFD700] text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* المعرض */}
        {/* المعرض */}
        <section className="px-4 py-6 bg-[#1f2937]">
          <h3
            className="text-2xl font-bold mb-4 text-center text-[#FFD700]"
            data-aos="fade-up"
          >
            المعرض
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[image1, image2, image3, image4].map((imgSrc, index) => (
              <div
                key={index}
                className="w-full h-52 overflow-hidden rounded-md cursor-pointer"
                data-aos="zoom-in"
                onClick={() => setSelectedImage(imgSrc)}
              >
                <img
                  src={imgSrc}
                  alt={`صورة ${index + 1} من المعرض`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* المودال المنبثق */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            {/* حاوية الصورة وزر الإغلاق */}
            <div
              className="relative max-w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند الضغط على المحتوى
            >
              {/* زر الإغلاق */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 left-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg z-10"
                aria-label="إغلاق"
              >
                ×
              </button>

              {/* الصورة */}
              <img
                src={selectedImage}
                alt="صورة مكبرة"
                className="rounded-lg shadow-lg max-w-full max-h-[80vh]"
              />
            </div>
          </div>
        )}

        {/* Call to Action إضافي */}
        <section className="p-8 text-center bg-[#111827]" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
            مظهر جديد يبدأ بخطوة
          </h3>
          <p className="text-gray-300 mb-4">
            نحن هنا لنمنحك تجربة فريدة. جرب الفرق بنفسك!
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="bg-[#FFD700] text-black px-6 py-3 rounded-lg text-lg hover:bg-yellow-400 transition font-bold shadow-md"
          >
            احجز الآن
          </button>
        </section>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-gray-400 border-t border-gray-700">
          <p>
            📞{" "}
            <a href="tel:0506540110" className="hover:text-[#FFD700]">
              050-6540110
            </a>{" "}
            | 🕒 من 10 صباحًا حتى 10 مساءً
          </p>
          <div className="flex justify-center gap-4 text-xl my-3 text-[#FFD700]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>
          </div>
          <p className="mt-2">© 2025 جميع الحقوق محفوظة - صالون جهاد</p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
