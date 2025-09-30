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
    return (
      <span>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    return (
      <span>
        {paymentStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <div>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>My Bookings</h1>
        <p>Manage your service appointments and requests</p>
      </div>

      {/* Status Tabs */}
      <div>
        <div>
          {['all', 'pending', 'confirmed', 'in-progress', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace('-', ' ').toUpperCase()} ({tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div>
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
            <a href="/services">
              Browse Services
            </a>
          )}
        </div>
      ) : (
        <div>
          {filteredBookings.map(booking => (
            <div key={booking.id}>
              <div>
                <div>
                  <h3>
                    {booking.service_title}
                  </h3>
                  <p>
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
                <div>
                  {getStatusBadge(booking.status)}
                  {getPaymentBadge(booking.payment_status || 'unpaid')}
                  <p>
                    KSh {booking.total_price}
                  </p>
                </div>
              </div>

              <div>
                <div>
                  <p>
                    <strong>Provider:</strong> {booking.provider_name}
                  </p>
                  <p>
                    <strong>Customer:</strong> {booking.buyer_name}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Booking ID:</strong> #{booking.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Providers */}
              {user.role === 'provider' && booking.status === 'pending' && (
                <div>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  >
                    Decline
                  </button>
                </div>
              )}

              {/* Action Buttons for Ongoing Bookings */}
              {user.role === 'provider' && booking.status === 'confirmed' && (
                <div>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'in-progress')}
                  >
                    Start Service
                  </button>
                </div>
              )}

              {user.role === 'provider' && booking.status === 'in-progress' && (
                <div>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                  >
                    Mark Complete
                  </button>
                </div>
              )}

              {/* Cancel Button for Buyers */}
              {user.role === 'buyer' && ['pending', 'confirmed'].includes(booking.status) && booking.payment_status === 'unpaid' && (
                <div>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
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