import React from 'react';
import { Link } from 'react-router-dom';


const ServiceCard = ({ service }) => {
  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="service-card">
      <div className="service-image">
        {/* Placeholder for service image */}
        <div className="image-placeholder">
          {service.category.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="service-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.description.substring(0, 100)}...</p>
        
        <div className="service-meta">
          <span className="service-category">{service.category}</span>
          <span className="service-location">📍 {service.city}</span>
        </div>
        
        <div className="service-rating">
          <span className="stars">{renderStars(service.rating)}</span>
          <span className="rating-text">({service.review_count} reviews)</span>
        </div>
        
        <div className="service-footer">
          <div className="service-price">
            Ksh{service.price} <span className="price-type">/{service.price_type}</span>
          </div>
          <div className="service-provider">
            by {service.provider_name}
          </div>
        </div>
        
        <Link to={`/services/${service.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;