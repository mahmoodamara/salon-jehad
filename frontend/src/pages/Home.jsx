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
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import image1 from "../assets/image 1.jpeg";
import image2 from "../assets/image 2.jpeg";
import image3 from "../assets/image 3.jpeg";
import image4 from "../assets/image 4.jpeg";
import image5 from "../assets/image6.png";

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
    { name: "محمود", comment: "خدمة ممتازة، شكراً لكم!", rating: 5 },
    { name: "بهاء", comment: "أفضل حلاقة حصلت عليها على الإطلاق.", rating: 5 },
    { name: "محمد", comment: "الجو مريح وفريق العمل محترف جدًا.", rating: 4 },
    { name: "أحمد", comment: "نتيجة الحلاقة تفوق التوقعات.", rating: 5 },
    { name: "خالد", comment: "خدمة سريعة وجودة عالية.", rating: 4 },
    { name: "يوسف", comment: "أجمل صالون في المنطقة.", rating: 5 },
  ];

  const iconMap = {
    "حلاقة ذقن": <GiBeard className="text-4xl mx-auto mb-3 text-gold" />,
    "قص شعر": <MdContentCut className="text-4xl mx-auto mb-3 text-gold" />,
    "حلاقة كاملة": <GiRazor className="text-4xl mx-auto mb-3 text-gold" />,
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
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div dir="rtl" className="bg-dark text-white font-cairo min-h-screen">
      {/* Navbar محسن */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-20 px-6 bg-navbar bg-opacity-90 shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-gold font-arabic">صالون جهاد</h1>
        <div className="flex items-center gap-6">
          <a
            href="https://wa.me/972506540110"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-gold transition-colors duration-300"
          >
            <FaWhatsapp className="text-2xl text-green-400" />
            <span className="hidden md:inline">تواصل عبر واتساب</span>
          </a>
          <button
            onClick={() => navigate("/booking")}
            className="hidden md:block bg-gold text-dark px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors duration-300 font-bold"
          >
            احجز الآن
          </button>
        </div>
      </nav>

      {/* Hero Section محسن */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <img
          src={image5}
          alt="صالون حلاقة"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp">
            تصفيف <span className="text-gold">احترافي</span> بأسلوبك
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fadeInUp delay-100">
            نحن نقدم تجربة حلاقة فريدة تمنحك مظهرًا أنيقًا وشعورًا بالثقة
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp delay-200">
            <button
              onClick={() => navigate("/booking")}
              className="bg-gold text-dark px-8 py-3 rounded-lg text-lg hover:bg-gold-dark transition-colors duration-300 font-bold shadow-lg transform hover:scale-105"
            >
              احجز الآن
            </button>
            <button
              onClick={() => navigate("/MyAppointments")}
              className="bg-transparent border-2 border-gold text-gold px-8 py-3 rounded-lg text-lg hover:bg-gold/10 transition-colors duration-300 font-bold shadow-lg transform hover:scale-105"
            >
              عرض حجوزاتي
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 animate-bounce">
          <div className="w-8 h-14 border-4 border-gold rounded-full flex justify-center p-1">
            <div className="w-2 h-2 bg-gold rounded-full animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* من نحن - محسن */}
      <section className="py-20 bg-dark-2">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h3 className="text-3xl font-bold text-gold mb-4 relative inline-block">
              <span className="relative">
                من نحن
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/50 rounded-full"></span>
              </span>
            </h3>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              في صالون جهاد، نؤمن بأن الحلاقة ليست مجرد خدمة، بل هي فن واهتمام
              بالتفاصيل. منذ تأسيسنا، كرسنا أنفسنا لتقديم تجربة استثنائية تجمع
              بين التقاليد العريقة والحديثة في عالم تصفيف الشعر والعناية بالذقن.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="bg-dark p-8 rounded-xl shadow-xl border border-gray-800 hover:border-gold/30 transition-all duration-500"
              data-aos="fade-up"
            >
              <div className="text-gold text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold text-white mb-3">رؤيتنا</h4>
              <p className="text-gray-400">
                أن نكون الوجهة الأولى للرجال الذين يبحثون عن الجودة والرفاهية في
                تجربة الحلاقة.
              </p>
            </div>

            <div
              className="bg-dark p-8 rounded-xl shadow-xl border border-gray-800 hover:border-gold/30 transition-all duration-500"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="text-gold text-4xl mb-4">✂️</div>
              <h4 className="text-xl font-bold text-white mb-3">خبرتنا</h4>
              <p className="text-gray-400">
                فريقنا من الحلاقين المحترفين لديهم سنوات من الخبرة في أحدث صيحات
                وتقنيات الحلاقة.
              </p>
            </div>

            <div
              className="bg-dark p-8 rounded-xl shadow-xl border border-gray-800 hover:border-gold/30 transition-all duration-500"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="text-gold text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-bold text-white mb-3">تميزنا</h4>
              <p className="text-gray-400">
                نستخدم أفضل المنتجات العالمية ونقدم خدمة شخصية تلبي توقعاتك
                وتتجاوزها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* فريق الحلاقة - محسن */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h3 className="text-3xl font-bold text-gold mb-4 relative inline-block">
              <span className="relative">
                فريق الحلاقة لدينا
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/50 rounded-full"></span>
              </span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              تعرف على فريقنا من الحلاقين المحترفين الذين يجعلون من كل زيارة
              تجربة لا تُنسى
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              loop
              className="pb-12"
            >
              {barbers.map((barber) => (
                <SwiperSlide key={barber._id}>
                  <div className="bg-dark-2 rounded-xl overflow-hidden shadow-2xl border border-gray-800 hover:border-gold/50 transition-all duration-500 h-full">
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={getPhotoUrl(barber.photo)}
                        alt={barber.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-2xl font-bold text-white">
                          {barber.name}
                        </h4>
                        {barber.expertise && (
                          <p className="text-gold text-sm">
                            {barber.expertise}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      {barber.bio && (
                        <p className="text-gray-400 mb-4">{barber.bio}</p>
                      )}
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate("/booking")}
                          className="bg-gold text-dark px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors duration-300 font-medium"
                        >
                          احجز مع {barber.name.split(" ")[0]}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* خدماتنا - محسن */}
      <section className="py-20 bg-dark-2">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h3 className="text-3xl font-bold text-gold mb-4 relative inline-block">
              <span className="relative">
                خدماتنا
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/50 rounded-full"></span>
              </span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              نقدم مجموعة متنوعة من الخدمات المصممة خصيصًا لاحتياجاتك
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-dark p-6 rounded-xl shadow-lg animate-pulse h-64"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-dark rounded-xl shadow-2xl overflow-hidden border border-gray-800 hover:border-gold/30 transition-all duration-500 group"
                  data-aos="fade-up"
                >
                  <div className="p-8 text-center">
                    {iconMap[service.name] || (
                      <MdContentCut className="text-4xl mx-auto mb-3 text-gold" />
                    )}
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                      {service.name}
                    </h4>
                    <div className="flex justify-center items-center gap-4 my-3">
                      <span className="text-gold text-lg font-bold">
                        💰 {service.price} ₪
                      </span>
                      <span className="text-gray-400">
                        ⏱️ {service.duration} دقيقة
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {service.description ||
                        "خدمة احترافية بمعايير عالية الجودة"}
                    </p>
                    <button
                      onClick={() => navigate("/booking")}
                      className="mt-4 bg-gold text-dark px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors duration-300 font-medium"
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* آراء الزبائن - محسن */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h3 className="text-3xl font-bold text-gold mb-4 relative inline-block">
              <span className="relative">
                آراء عملائنا
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/50 rounded-full"></span>
              </span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              ما يقوله عملاؤنا عن تجربتهم معنا
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            loop
            className="pb-12"
          >
            {customerReviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="bg-dark-2 p-8 rounded-xl shadow-lg border border-gray-800 h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, starIdx) => (
                      <FaStar
                        key={starIdx}
                        className={`text-lg ${
                          starIdx < review.rating
                            ? "text-gold"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-lg mb-6">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mr-4">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.name}</p>
                      <p className="text-sm text-gray-400">عميل دائم</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* المعرض - محسن */}
      <section className="py-16 bg-dark-2">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <h3 className="text-3xl font-bold text-gold mb-4 relative inline-block">
              <span className="relative">
                معرض أعمالنا
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gold/50 rounded-full"></span>
              </span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              لمحة عن أجواء صالوننا ونتائج أعمالنا
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[image1, image2, image3, image4].map((imgSrc, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                onClick={() => setSelectedImage(imgSrc)}
              >
                <img
                  src={imgSrc}
                  alt={`صورة ${index + 1} من المعرض`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    عرض الصورة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* مودال الصورة المكبرة */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 left-0 text-white hover:text-gold text-3xl z-10 transition-colors duration-200"
              aria-label="إغلاق"
            >
              <IoMdClose />
            </button>
            <img
              src={selectedImage}
              alt="صورة مكبرة"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Call to Action محسن */}
      <section className="py-20 bg-gradient-to-r from-dark to-dark-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI0ZGQkMwMCIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')]"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h3
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            مستعد <span className="text-gold">لتجربة فريدة</span>؟
          </h3>
          <p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            احجز موعدك الآن واستمتع بأفضل خدمات الحلاقة والعناية بالشعر
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <button
              onClick={() => navigate("/booking")}
              className="bg-gold text-dark px-8 py-4 rounded-lg text-lg hover:bg-gold-dark transition-colors duration-300 font-bold shadow-lg transform hover:scale-105"
            >
              احجز موعدك الآن
            </button>
            <a
              href="https://wa.me/972506540110"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-lg text-lg hover:bg-gold/10 transition-colors duration-300 font-bold shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-xl" /> تواصل عبر واتساب
            </a>
          </div>
        </div>
      </section>

      {/* Footer محسن */}
      <footer className="bg-dark-2 pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-gold rounded-full mr-2"></span>
                صالون جهاد
              </h4>
              <p className="text-gray-400 mb-4">
                وجهتك المفضلة للحلاقة والتصفيف الاحترافي بمعايير عالمية.
              </p>
              <div className="flex gap-4">
                <a
                  href=""
                  className="text-gray-400 hover:text-gold transition-colors duration-300"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href=""
                  className="text-gray-400 hover:text-gold transition-colors duration-300"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href=""
                  className="text-gray-400 hover:text-gold transition-colors duration-300"
                >
                  <FaTiktok className="text-xl" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href=""
                    className="text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    الخدمات
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    فريق العمل
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    المعرض
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="text-gray-400 hover:text-gold transition-colors duration-300"
                  >
                    اتصل بنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">ساعات العمل</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FaClock /> الأحد - الخميس: 10 صباحًا - 10 مساءً
                </li>
                <li className="flex items-center gap-2">
                  <FaClock /> الجمعة - السبت: 11 صباحًا - 11 مساءً
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FaPhone className="text-gold" />
                  <a
                    href="tel:0506540110"
                    className="hover:text-gold transition-colors duration-300"
                  >
                    050-6540110
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaWhatsapp className="text-gold" />
                  <a
                    href="https://wa.me/972506540110"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors duration-300"
                  >
                    واتساب
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gold" />
                  <span>عنوان الصالون، المدينة</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} صالون جهاد. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* إضافة بعض الأنيميشنز والستايلز */}
      <style jsx global>{`
        :root {
          --gold:rgb(193, 168, 29);
          --gold-dark:rgb(162, 144, 43);
          --dark: #111827;
          --dark-2: #1f2937;
          --navbar: rgba(31, 41, 55, 0.95);
        }

        .bg-gold {
          background-color: var(--gold);
        }
        .bg-gold-dark {
          background-color: var(--gold-dark);
        }
        .bg-dark {
          background-color: var(--dark);
        }
        .bg-dark-2 {
          background-color: var(--dark-2);
        }
        .bg-navbar {
          background-color: var(--navbar);
        }
        .text-gold {
          color: var(--gold);
        }
        .border-gold {
          border-color: var(--gold);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fadeInUp.delay-100 {
          animation-delay: 0.1s;
        }

        .animate-fadeInUp.delay-200 {
          animation-delay: 0.2s;
        }

        .animate-scroll {
          animation: scroll 2s infinite;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .font-arabic {
          font-family: "Arial", sans-serif;
        }

        .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.5 !important;
        }

        .swiper-pagination-bullet-active {
          background: var(--gold) !important;
          opacity: 1 !important;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: var(--gold) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
