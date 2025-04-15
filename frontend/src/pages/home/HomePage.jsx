import { useEffect } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ServiceQuantumSwiper from '../../components/ServiceQuantumSwiper';
import InteractiveQuantumMap from '../../components/InteractiveQuantumMap';
import QuantumMarquee from '../../components/QuantumMarquee';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { entangle, observeQuantumState } = useQuantum();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    // Entrelacement quantique de la vue
    const cleanup = entangle('home_view', {
      coordinates: [36.7525, 3.0420], // Alger par défaut
      language: i18n.language,
      interactionLevel: 0.9
    });

    // Observation des changements de position
    const observer = observeQuantumState('user_position', position => {
      console.log('Position quantique mise à jour:', position);
    });

    return () => {
      cleanup();
      observer();
    };
  }, [i18n.language]);

  // Animations premium
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="home-page" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Section Hero avec effet parallaxe */}
      <section className="quantum-hero">
        <div className="hero-content">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ delay: 0.2 }}
            className="hero-title"
          >
            <span className="gradient-text">{t('home.hero.title')}</span>
          </motion.h1>
          
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ delay: 0.4 }}
            className="hero-subtitle"
          >
            {t('home.hero.subtitle')}
          </motion.p>
        </div>
        
        <div className="hero-actions">
          <QuantumMarquee />
        </div>
      </section>

      {/* Swiper des services quantiques */}
      <section className="quantum-services">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -50% 0px" }}
        >
          <h2 className="section-title">{t('home.featured_services')}</h2>
          <ServiceQuantumSwiper />
        </motion.div>
      </section>

      {/* Carte interactive quantique */}
      <section className="quantum-map-section">
        <InteractiveQuantumMap 
          initialCenter={[28.0339, 1.6596]} // Centre de l'Algérie
          zoomLevel={6}
          quantumMode={true}
        />
      </section>
    </div>
  );
};

export default HomePage;