import { motion, AnimatePresence } from 'framer-motion';
import { useQuantum } from '../context/QuantumContext';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';

const QuantumNotification = ({ message, onClose }) => {
  const { t, i18n } = useTranslation();
  const { coherence } = useQuantum();
  const isArabic = i18n.language === 'ar';

  const notificationVariants = {
    hidden: { 
      opacity: 0,
      x: isArabic ? 100 : -100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`quantum-notification ${isArabic ? 'rtl' : 'ltr'}`}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="notification-content">
            <div className="message-container">
              <span className="coherence-badge">
                {Math.round(coherence * 100)}%
              </span>
              <p className="message-text">
                {isArabic ? message.ar : message.fr}
              </p>
            </div>
            
            <button 
              className="close-button"
              onClick={onClose}
              aria-label={t('close_notification')}
            >
              <IoClose className="close-icon" />
            </button>
          </div>

          <div className="quantum-timeline">
            <motion.div
              className="timeline-progress"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              onAnimationComplete={onClose}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantumNotification;