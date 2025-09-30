import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import ServiceCard from '../components/services/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    minRating: ''
  });
  
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchServicesAndCategories = useCallback(async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        apiService.getServices(filters),
        apiService.getCategories()
      ]);
      
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Get filters from URL
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    
    if (category || city) {
      setFilters({
        category: category || '',
        city: city || '',
        minRating: ''
      });
    }
    
    fetchServicesAndCategories();
  }, [searchParams, fetchServicesAndCategories]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with filters
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.city) params.set('city', newFilters.city);
    setSearchParams(params);
    
    // Refetch services with new filters
    fetchServicesWithFilters(newFilters);
  };

  const fetchServicesWithFilters = async (filterParams) => {
    setLoading(true);
    try {
      const response = await apiService.getServices(filterParams);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching filtered services:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', city: '', minRating: '' });
    setSearchParams({});
    fetchServicesWithFilters({});
  };

  return (
    <div className="services-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Services</h1>
          <p>Discover skilled professionals in your area</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter city..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <select 
                value={filters.minRating} 
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="loading">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="no-services">
            <h3>No services found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="results-count">
              <p>Found {services.length} service{services.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;