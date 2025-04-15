import { motion, AnimatePresence } from 'framer-motion';
import { useQuantum } from '../context/QuantumContext';
import { useTranslation } from 'react-i18next';

const QuantumLoader = ({ isLoading }) => {
  const { t, i18n } = useTranslation();
  const { coherence } = useQuantum();
  const isArabic = i18n.language === 'ar';

  // Configuration des particules quantiques
  const PARTICLES = Array(12).fill().map((_, i) => ({
    id: `particle-${i}`,
    path: `M ${20 * Math.cos((i * 30) * Math.PI/180)} ${20 * Math.sin((i * 30) * Math.PI/180)} L 0 0`,
    delay: i * 0.1
  }));

  // Variants d'animation quantique
  const quantumVariants = {
    hidden: { opacity: 0 },
    visible: (delay) => ({
      opacity: [0.2, 1, 0.2],
      transition: {
        delay,
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="quantum-loader-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="quantum-sphere" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Sphère quantique centrale */}
            <motion.div 
              className="core"
              animate={{
                scale: [0.8, 1.2, 0.8],
                background: [
                  `radial-gradient(circle, var(--primary-300), var(--primary-500))`,
                  `radial-gradient(circle, var(--primary-500), var(--accent-500))`
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity
              }}
            />

            {/* Particules en superposition */}
            {PARTICLES.map((particle) => (
              <motion.svg
                key={particle.id}
                className="quantum-particle"
                viewBox="-25 -25 50 50"
                custom={particle.delay}
                variants={quantumVariants}
                initial="hidden"
                animate="visible"
              >
                <path 
                  d={particle.path} 
                  stroke="var(--primary-300)" 
                  strokeWidth="2"
                  fill="none"
                />
              </motion.svg>
            ))}

            {/* Affichage de la cohérence */}
            <div className="coherence-display">
              <span className="percentage">
                {Math.round(coherence * 100)}%
              </span>
              <div className="label">
                {t('quantum_coherence')}
              </div>
            </div>
          </div>

          {/* Messages de chargement bilingues */}
          <motion.div 
            className="loading-messages"
            animate={{
              opacity: [0.8, 1, 0.8],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          >
            <div className={`message ${!isArabic ? 'active' : ''}`}>
              {t('quantum_loading')}
            </div>
            <div className={`message ${isArabic ? 'active' : ''}`}>
              {t('quantum_loading_ar')}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantumLoader;