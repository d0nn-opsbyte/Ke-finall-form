import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const response = await apiService.getUserBookings(user.id);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      fetchUserBookings();
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      alert('Error updating booking: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'booking-status-pending',
      confirmed: 'booking-status-confirmed',
      'in-progress': 'booking-status-in-progress',
      completed: 'booking-status-completed',
      cancelled: 'booking-status-cancelled'
    };

    return (
      <span className={`booking-status-badge ${statusColors[status] || 'booking-status-default'}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your service appointments and requests</p>
      </div>

      {/* Status Tabs */}
      <div className="bookings-tabs">
        <div className="tabs-container">
          {['all', 'pending', 'confirmed', 'in-progress', 'completed'].map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace('-', ' ').toUpperCase()} ({tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <h3>
            {activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
          </h3>
          <p>
            {activeTab === 'all' 
              ? 'Book your first service to get started!' 
              : `You don't have any ${activeTab} bookings at the moment.`
            }
          </p>
          {activeTab === 'all' && (
            <a href="/services" className="btn btn-primary">
              Browse Services
            </a>
          )}
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div>
                  <h3 className="booking-title">
                    {booking.service_title}
                  </h3>
                  <p className="booking-date">
                    {new Date(booking.booking_date).toLocaleDateString('en-KE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="booking-meta">
                  {getStatusBadge(booking.status)}
                  <p className="booking-price">
                    KSh {booking.total_price}
                  </p>
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-info">
                  <p className="booking-text">
                    <strong>Provider:</strong> {booking.provider_name}
                  </p>
                  <p className="booking-text">
                    <strong>Customer:</strong> {booking.buyer_name}
                  </p>
                </div>
                <div className="booking-info">
                  <p className="booking-text">
                    <strong>Booking ID:</strong> #{booking.id}
                  </p>
                  <p className="booking-text">
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Providers */}
              {user.role === 'provider' && booking.status === 'pending' && (
                <div className="booking-actions">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    className="btn btn-primary btn-sm"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="btn btn-secondary btn-sm"
                  >
                    Decline
                  </button>
                </div>
              )}

              {/* Action Buttons for Ongoing Bookings */}
              {user.role === 'provider' && booking.status === 'confirmed' && (
                <div className="booking-actions">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'in-progress')}
                    className="btn btn-primary btn-sm"
                  >
                    Start Service
                  </button>
                </div>
              )}

              {user.role === 'provider' && booking.status === 'in-progress' && (
                <div className="booking-actions">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                    className="btn btn-primary btn-sm"
                  >
                    Mark Complete
                  </button>
                </div>
              )}

              {/* Cancel Button for Buyers */}
              {user.role === 'buyer' && ['pending', 'confirmed'].includes(booking.status) && (
                <div className="booking-actions">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;