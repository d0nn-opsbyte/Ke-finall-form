import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const EarningsDashboard = ({ providerId }) => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [providerId]);

  const fetchEarnings = async () => {
    try {
      const response = await apiService.getProviderEarnings(providerId);
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading earnings...</div>;
  if (!earnings) return <div>Error loading earnings data</div>;

  return (
    <div className="earnings-dashboard">
      <h2>Earnings Overview</h2>
      
      <div className="earnings-cards">
        <div className="earnings-card total-earnings">
          <h3>Total Earnings</h3>
          <div className="amount">KSh {earnings.total_earnings.toLocaleString()}</div>
          <p>Amount received after fees</p>
        </div>
        
        <div className="earnings-card platform-fees">
          <h3>Platform Fees</h3>
          <div className="amount">KSh {earnings.total_commission.toLocaleString()}</div>
          <p>10% service fee</p>
        </div>
        
        <div className="earnings-card completed-jobs">
          <h3>Completed Jobs</h3>
          <div className="amount">{earnings.payment_count}</div>
          <p>Total paid services</p>
        </div>
      </div>

      <div className="recent-payments">
        <h3>Recent Payments</h3>
        {earnings.recent_payments.length === 0 ? (
          <p>No payments yet</p>
        ) : (
          <div className="payments-list">
            {earnings.recent_payments.map(payment => (
              <div key={payment.id} className="payment-item">
                <div className="payment-info">
                  <strong>{payment.service_title}</strong>
                  <span>KSh {payment.amount.toLocaleString()}</span>
                </div>
                <div className="payment-meta">
                  <span>{new Date(payment.date).toLocaleDateString()}</span>
                  <span>Receipt: {payment.mpesa_receipt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsDashboard;