import { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';

const MainLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isArabic, setIsArabic] = useState(i18n.language === 'ar');

  // Configuration avancée du Swiper
  const swiperParams = {
    modules: [Navigation, EffectCoverflow],
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 5,
      stretch: 80,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    navigation: true,
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet>
        <html lang={isArabic ? 'ar' : 'fr'} />
        <style>
          {`:root {
            --primary-color: ${isArabic ? '#2A5D5C' : '#0F3D3E'};
            --accent-color: #FF6B6B;
            --font-primary: ${isArabic ? "'Tajawal', sans-serif" : "'Inter', sans-serif"};
          }`}
        </style>
      </Helmet>

      {/* Navigation Premium */}
      <nav className="glass-navbar">
        <div className="nav-container">
          <Swiper {...swiperParams} className="category-swiper">
            {[...Array(12)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className="category-tile">
                  <i className={`icon-${categories[i].icon}`} />
                  <span>{t(`categories.${categories[i].name}`)}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="nav-actions">
            <button 
              className="lang-toggle"
              onClick={() => {
                const newLang = isArabic ? 'fr' : 'ar';
                i18n.changeLanguage(newLang);
                setIsArabic(!isArabic);
              }}
            >
              {isArabic ? 'العربية' : 'Français'}
            </button>
          </div>
        </div>
      </nav>

      <Suspense fallback={<LoadingOverlay />}>
        <main className="content-wrapper">{children}</main>
      </Suspense>
    </div>
  );
};

export default MainLayout;