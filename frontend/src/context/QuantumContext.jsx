import { createContext, useContext, useMemo, useEffect } from 'react';
import { useQuantumEngine } from '../hooks/useQuantumEngine';
import { quantumFetch } from '../services/api';
import { useTranslation } from 'react-i18next';

const QuantumContext = createContext();

export const QuantumProvider = ({ children }) => {
  const { t } = useTranslation();
  const quantumEngine = useQuantumEngine();
  const [quantumState, setQuantumState] = useState('coherent');
  const [entangledParticles, setEntangledParticles] = useState([]);

  // Synchronisation quantique globale
  useEffect(() => {
    const quantumSync = async () => {
      try {
        const { state } = await quantumFetch({
          url: '/quantum/state',
          quantum: true
        });
        
        setQuantumState(state);
        quantumEngine.maintainCoherence(state.coherenceLevel);
      } catch (error) {
        console.error(t('quantum_error'), error);
      }
    };

    quantumSync();
    const interval = setInterval(quantumSync, 30000);
    return () => clearInterval(interval);
  }, []);

  // Interface de contexte optimisée
  const value = useMemo(() => ({
    ...quantumEngine,
    quantumState,
    entangledParticles,
    createEntanglement: (key, payload) => {
      const particle = quantumEngine.entangle(key, payload, {
        quantumField: 'global',
        superposition: true
      });
      setEntangledParticles(prev => [...prev, particle]);
      return particle;
    },
    observeQuantumState: (key, callback) => {
      return quantumEngine.observe(key, (state) => {
        callback({
          ...state,
          formattedValue: formatQuantumValue(state.value)
        });
      });
    },
    collapseEntanglement: async (key) => {
      const probability = await quantumEngine.collapse(key);
      return {
        probability: Math.round(probability * 100),
        status: quantumState
      };
    }
  }), [quantumEngine, quantumState, entangledParticles]);

  return (
    <QuantumContext.Provider value={value}>
      <div className={`quantum-overlay ${quantumState}`}>
        {children}
      </div>
    </QuantumContext.Provider>
  );
};

// Hook de contexte haute fidélité
export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error(t('quantum_context_error'));
  }
  return context;
};

// Helpers quantiques
const formatQuantumValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(v => ({ ...v, probability: v.probability * 100 }));
  }
  return { ...value, probability: value.probability * 100 };
};

// Types TypeScript avancés
/**
 * @typedef {Object} QuantumContextValue
 * @property {function} createEntanglement - Crée une intrication quantique
 * @property {function} observeQuantumState - Observe un état quantique
 * @property {function} collapseEntanglement - Collapse un état quantique
 * @property {string} quantumState - État global du système
 * @property {Array} entangledParticles - Liste des particules intriquées
 * @property {number} coherence - Niveau de cohérence quantique
 */