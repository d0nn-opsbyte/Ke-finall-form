import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import ServiceCard from '../components/services/ServiceCard';


const Home = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        apiService.getServices(),
        apiService.getCategories()
      ]);
      
      setServices(servicesRes.data.slice(0, 6)); // Show only 6 services
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Trusted Service Providers Near You
          </h1>
          <p className="hero-subtitle">
            From home cleaning to tutoring, connect with skilled professionals in your area
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/services?category=${category}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category.charAt(0).toUpperCase()}
                </div>
                <h3 className="category-name">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Services</h2>
            <Link to="/services" className="view-all-link">
              View All Services →
            </Link>
          </div>
          
          {loading ? (
            <div className="loading">Loading services...</div>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;