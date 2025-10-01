import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PaymentModel from '../components/payment/PaymentModel';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    duration: 1,
    location_address: '',
    special_requests: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [recentBooking, setRecentBooking] = useState(null);

  const fetchServiceDetails = useCallback(async () => {
    try {
      const [serviceRes, reviewsRes] = await Promise.all([
        apiService.getService(id),
        apiService.getServiceReviews(id)
      ]);
      
      setService(serviceRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleBookingAndPay = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book a service');
      return;
    }

    try {
      const bookingPayload = {
        service_id: parseInt(id),
        buyer_id: user.id,
        ...bookingData
      };
      
      const response = await apiService.createBooking(bookingPayload);
      const newBooking = response.data;
      
      // Store the booking and show payment modal
      setRecentBooking({
        id: newBooking.booking_id,
        service_title: newBooking.service_title,
        total_price: newBooking.total_price
      });
      setShowPaymentModal(true);
      
      // Reset form
      setBookingData({
        booking_date: '',
        duration: 1,
        location_address: '',
        special_requests: ''
      });
    } catch (error) {
      alert('Error creating booking: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) return <div className="loading">Loading service details...</div>;
  if (!service) return <div className="error">Service not found</div>;

  return (
    <div className="service-detail">
      <div className="container">
        <div className="service-detail-grid">
          {/* Service Info */}
          <div className="service-info">
            <div className="service-header">
              <h1>{service.title}</h1>
              <div className="service-meta">
                <span className="category-badge">{service.category}</span>
                <span className="location">📍 {service.city}</span>
              </div>
            </div>

            <div className="service-description">
              <p>{service.description}</p>
            </div>

            <div className="service-details">
              <div className="detail-item">
                <strong>Price:</strong> KSh {service.price} / {service.price_type}
              </div>
              <div className="detail-item">
                <strong>Availability:</strong> {service.availability_days || 'Mon-Fri'}
              </div>
              <div className="detail-item">
                <strong>Time:</strong> {service.availability_start} - {service.availability_end}
              </div>
              <div className="detail-item">
                <strong>Rating:</strong> {renderStars(service.rating)} ({service.review_count} reviews)
              </div>
            </div>

            {/* Provider Info */}
            <div className="provider-info">
              <h3>About the Provider</h3>
              <div className="provider-card">
                <div className="provider-avatar">
                  {service.provider.name.charAt(0).toUpperCase()}
                </div>
                <div className="provider-details">
                  <h4>{service.provider.name}</h4>
                  <p>📍 {service.provider.city}</p>
                  <p>📞 {service.provider.phone || 'Phone not provided'}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <h3>Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this service!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <strong>{review.reviewer_name}</strong>
                        <span className="review-rating">
                          {renderStars(review.rating)}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <small className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-section">
            <div className="booking-card">
              <h3>Book This Service</h3>
              
              {!user ? (
                <div className="login-prompt">
                  <p>Please login to book this service</p>
                  <Link to="/login" className="btn btn-primary">
                    Login to Book
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBookingAndPay}>
                  <div className="form-group">
                    <label>Booking Date</label>
                    <input
                      type="datetime-local"
                      value={bookingData.booking_date}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        booking_date: e.target.value
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration ({service.price_type})</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        duration: parseInt(e.target.value)
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Service Location</label>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      value={bookingData.location_address}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        location_address: e.target.value
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Requests (Optional)</label>
                    <textarea
                      placeholder="Any special requirements..."
                      value={bookingData.special_requests}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        special_requests: e.target.value
                      })}
                      rows="3"
                    />
                  </div>

                  <div className="booking-summary">
                    <div className="price-calculation">
                      <span>Total: </span>
                      <strong>KSh {(service.price * bookingData.duration).toFixed(2)}</strong>
                    </div>
                    <div className="commission-breakdown">
                      <small>Includes 10% platform fee: KSh {(service.price * bookingData.duration * 0.10).toFixed(2)}</small>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-book">
                    Book 
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ServiceDetail;