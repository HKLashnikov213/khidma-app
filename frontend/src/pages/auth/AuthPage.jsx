import { useState, useEffect } from 'react';
import { useQuantum } from '../../context/QuantumContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import QuantumLoader from '../../components/QuantumLoader/QuantumLoader';
import AuthForm from '../../components/AuthForm';

const AuthPage = () => {
  const { t, i18n } = useTranslation();
  const { entangle, collapseEntanglement } = useQuantum();
  const [activeTab, setActiveTab] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Effets de transition quantique
  useEffect(() => {
    const quantumEffect = entangle('auth_flow', {
      step: otpSent ? 'verification' : 'initial',
      language: i18n.language
    });

    return () => quantumEffect();
  }, [otpSent, i18n.language]);

  // Gestionnaire de soumission premium
  const handleQuantumAuth = async (values) => {
    setIsLoading(true);
    try {
      await collapseEntanglement('auth_process', {
        type: activeTab,
        ...values
      });
      
      if (!otpSent) {
        startOtpCountdown();
        setOtpSent(true);
      } else {
        // Redirection quantique
        window.location.href = `/${activeTab}-dashboard`;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Compte à rebours OTP
  const startOtpCountdown = () => {
    setRemainingTime(120);
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <div className="auth-page" dir={i18n.dir()}>
      <QuantumLoader isLoading={isLoading} />

      <div className="auth-container">
        {/* En-tête holographique */}
        <div className="quantum-header">
          <h1 className="gradient-text">{t('auth.title')}</h1>
          <p className="subtitle">{t('auth.subtitle')}</p>
        </div>

        {/* Sélecteur de rôle */}
        <Swiper
          className="role-switcher"
          allowTouchMove={false}
          initialSlide={activeTab === 'client' ? 0 : 1}
        >
          <SwiperSlide>
            <button 
              className={`role-btn ${activeTab === 'client' ? 'active' : ''}`}
              onClick={() => setActiveTab('client')}
            >
              {t('auth.client')}
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button
              className={`role-btn ${activeTab === 'prestataire' ? 'active' : ''}`}
              onClick={() => setActiveTab('prestataire')}
            >
              {t('auth.prestataire')}
            </button>
          </SwiperSlide>
        </Swiper>

        {/* Formulaire quantique */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab + otpSent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AuthForm
              activeTab={activeTab}
              otpSent={otpSent}
              remainingTime={remainingTime}
              onSubmit={handleQuantumAuth}
              onResendOtp={startOtpCountdown}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;