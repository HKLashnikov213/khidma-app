import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-ar';
import { useQuantumEngine } from '../hooks/useQuantumEngine';
import { decode } from 'geobuf';
import Pbf from 'pbf';

const QuantumMap = ({ onPositionChange, services }) => {
  const mapRef = useRef(null);
  const [quantumLayer, setQuantumLayer] = useState(null);
  const { entangle, observe } = useQuantumEngine();
  const [arMode, setArMode] = useState(false);

  // Configuration quantique initiale
  useEffect(() => {
    const initQuantumLayer = async () => {
      const response = await fetch('/data/algeria_quantum.pbf');
      const buffer = await response.arrayBuffer();
      const data = decode(new Pbf(new Uint8Array(buffer)));
      
      const quantumLayer = L.quantumLayer(data, {
        entanglement: true,
        quantumField: 'services',
        superposition: true
      }).addTo(mapRef.current);

      setQuantumLayer(quantumLayer);
      entangle('map_layer', quantumLayer);
    };

    initQuantumLayer();
    return () => quantumLayer?.remove();
  }, []);

  // Gestion des événements AR
  const ARHandler = () => {
    useMapEvents({
      arfound: (e) => {
        observe('ar_marker', e.marker, {
          onCollapse: (state) => handleARCollapse(state)
        });
      }
    });
    return null;
  };

  // Calcul d'itinéraire quantique
  const calculateQuantumRoute = async (start, end) => {
    const response = await quantumLayer.calculateRoute({
      start: entangle('position', start),
      end: entangle('position', end),
      optimization: 'quantum'
    });
    
    return response.trajectories.map(t => ({
      ...t,
      probability: t.probability * 100
    }));
  };

  return (
    <div className="quantum-map-container">
      <MapContainer
        center={[28.0339, 1.6596]} // Centre de l'Algérie
        zoom={7}
        ref={mapRef}
        quantumMode={arMode}
        arOptions={{
          detectionMode: 'marker',
          quantumTracking: true
        }}
      >
        <TileLayer
          url={arMode ? '' : 'https://{s}.tile.quantum.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution='&copy; <a href="https://www.quantumosm.org">QuantumOSM</a>'
        />
        
        {arMode && <ARHandler />}
        
        {/* Affichage des services en superposition quantique */}
        {services.map(service => (
          <QuantumMarker 
            key={service.id} 
            service={service}
            onObserve={observe}
          />
        ))}
      </MapContainer>

      <div className="quantum-controls">
        <button 
          className="ar-toggle"
          onClick={() => setArMode(!arMode)}
        >
          {arMode ? 'Mode Carte' : 'Mode AR'}
        </button>
      </div>
    </div>
  );
};

const QuantumMarker = ({ service, onObserve }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      onObserve(`service_${service.id}`, markerRef.current, {
        collapseThreshold: 0.8,
        onObservation: (state) => handleServiceObservation(state)
      });
    }
  }, [service]);

  return (
    <Marker
      position={service.quantumCoordinates}
      ref={markerRef}
      quantumProperties={{
        entanglementLevel: service.rating,
        probabilityWave: service.availability
      }}
    >
      <Popup quantumTransition>
        <ServicePopup service={service} />
      </Popup>
    </Marker>
  );
};