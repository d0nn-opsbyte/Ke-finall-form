import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import PaymentModel from '../components/payment/PaymentModel';

const CompletedBookings = () => {
  const { user } = useAuth();
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCompletedUnpaidBookings();
    }
  }, [user]);

  const fetchCompletedUnpaidBookings = async () => {
    try {
      const response = await apiService.getCompletedUnpaidBookings(user.id);
      setCompletedBookings(response.data);
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchCompletedUnpaidBookings();
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading completed services...</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="page-header">
        <h1>Completed Services - Ready for Payment</h1>
        <p>Pay for services you've received</p>
      </div>

      {completedBookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No completed services awaiting payment</h3>
          <p>Services you've completed will appear here for payment</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {completedBookings.map(booking => (
            <div key={booking.id} className="booking-card completed-booking">
              <div className="booking-header">
                <div>
                  <h3 className="booking-title">
                    {booking.service_title}
                  </h3>
                  <p className="booking-date">
                    Service Date: {new Date(booking.booking_date).toLocaleDateString('en-KE')}
                  </p>
                  <div className="service-completed-badge">
                    ✅ Service Completed
                  </div>
                </div>
                <div className="booking-meta">
                  <p className="booking-price">
                    KSh {booking.total_price}
                  </p>
                  <p className="payment-due">
                    Payment Due
                  </p>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-info">
                  <p className="booking-text">
                    <strong>Provider:</strong> {booking.provider_name}
                  </p>
                  <p className="booking-text">
                    <strong>Status:</strong> Service completed - Ready for payment
                  </p>
                </div>
              </div>

              <div className="booking-actions">
                <button
                  onClick={() => handlePayNow(booking)}
                  className="btn btn-primary"
                >
                  Pay Now
                </button>
                <button className="btn btn-secondary">
                  Contact Provider
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <PaymentModel
          booking={selectedBooking}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CompletedBookings;