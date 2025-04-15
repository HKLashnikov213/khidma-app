// frontend/src/pages/ClientDashboard/ServicesList.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getServices } from '../../services/api'; // Assure-toi que tu as cette fonction dans 'api.js'
import './ServicesList.css';

const ServicesList = () => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
  });

  const { data, isLoading, isError } = useQuery('services', () => getServices(filters));

  useEffect(() => {
    // Optionnel: tu peux afficher les services en fonction des filtres quand l'état change
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  if (isLoading) return <QuantumLoader />;
  if (isError) return <div>Error loading services.</div>;

  return (
    <div className="services-list-container">
      <div className="filters">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select Category</option>
          <option value="web">Web</option>
          <option value="design">Design</option>
          <option value="consulting">Consulting</option>
        </select>
        
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="services-list">
        {data?.map((service) => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>Status: {service.status}</p>
            <p>Category: {service.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
