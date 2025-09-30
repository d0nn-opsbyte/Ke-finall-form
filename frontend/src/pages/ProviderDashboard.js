import React from 'react';
import { useAuth } from '../context/AuthContext';
import EarningsDashboard from '../components/payment/EarningsDashboard';

const ProviderDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'provider') {
    return (
      <div className="container mx-auto p-6">
        <div className="error-message">
          This page is only available for service providers.
        </div>
      </div>
    );
  }

  return (
    <div className="provider-dashboard">
      <div className="container mx-auto p-6">
        <div className="page-header">
          <h1>Provider Dashboard</h1>
          <p>Manage your services and track your earnings</p>
        </div>

        <div className="dashboard-grid">
          <div className="earnings-section">
            <EarningsDashboard providerId={user.id} />
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-cards">
              <a href="/services" className="action-card">
                <h4>Browse Services</h4>
                <p>See what other providers are offering</p>
              </a>
              <a href="/bookings" className="action-card">
                <h4>Manage Bookings</h4>
                <p>View and manage your bookings</p>
              </a>
              <div className="action-card">
                <h4>Total Earnings</h4>
                <p>Track your income and platform fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;