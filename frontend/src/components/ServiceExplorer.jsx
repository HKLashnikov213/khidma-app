import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import AdvancedFilterSystem from './AdvancedFilterSystem';

const ServiceExplorer = ({ services }) => {
  const { t, i18n } = useTranslation();
  const map = useMap();
  const [geoData, setGeoData] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    rating: 4,
    priceRange: [0, 10000],
    wilaya: 'all'
  });

  // Configuration avancée des marqueurs
  const customIcon = L.icon({
    iconUrl: '/assets/map-marker.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // Système de géolocalisation intelligent
  useEffect(() => {
    const fetchWilayas = async () => {
      const response = await import('../data/algeria-geo.json');
      const geoJSON = L.geoJSON(response.default, {
        style: () => ({
          color: '#2A5D5C',
          weight: 2,
          opacity: 0.7
        })
      }).addTo(map);
      setGeoData(geoJSON);
    };

    fetchWilayas();
    return () => geoData?.remove();
  }, []);

  // Moteur de filtrage ultra-performant
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = activeFilters.category ? 
        service.categoryTree.includes(activeFilters.category) : true;
      const matchesRating = service.rating >= activeFilters.rating;
      const matchesPrice = service.price >= activeFilters.priceRange[0] && 
        service.price <= activeFilters.priceRange[1];
      const matchesWilaya = activeFilters.wilaya === 'all' || 
        service.wilaya === activeFilters.wilaya;

      return matchesCategory && matchesRating && matchesPrice && matchesWilaya;
    });
  }, [services, activeFilters]);

  // Système de catégorisation hiérarchique
  const categoryTree = useMemo(() => {
    const tree = {};
    services.forEach(service => {
      service.categoryTree.forEach((cat, index) => {
        const path = service.categoryTree.slice(0, index + 1).join('.');
        if (!tree[path]) {
          tree[path] = {
            name: cat,
            count: 0,
            children: {}
          };
        }
        tree[path].count++;
      });
    });
    return tree;
  }, [services]);

  return (
    <div className="service-explorer-container">
      <AdvancedFilterSystem 
        categories={categoryTree}
        filters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      <div className="map-container">
        {filteredServices.map(service => (
          <Marker
            key={service.id}
            position={service.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => {/* Gestion des interactions premium */}
            }}
          >
            <Popup className="custom-popup">
              <ServicePopupContent service={service} />
            </Popup>
          </Marker>
        ))}
      </div>

      <div className="service-grid">
        {filteredServices.map(service => (
          <ServiceCard 
            key={service.id}
            service={service}
            lang={i18n.language}
          />
        ))}
      </div>
    </div>
  );
};

// Composant interne de carte de service
const ServiceCard = ({ service, lang }) => (
  <div className="premium-service-card">
    <div className="service-header">
      <h3>{lang === 'ar' ? service.title_ar : service.title_fr}</h3>
      <div className="rating-badge">
        ⭐ {service.rating.toFixed(1)}
      </div>
    </div>
    
    <div className="category-tree">
      {service.categoryTree.map((cat, index) => (
        <span key={index} className="category-tag">
          {cat}
        </span>
      ))}
    </div>

    <div className="service-meta">
      <span className="price-tag">
        {service.price.toLocaleString()} DZD
      </span>
      <span className="wilaya-badge">
        {service.wilaya}
      </span>
    </div>
  </div>
);

export default ServiceExplorer;