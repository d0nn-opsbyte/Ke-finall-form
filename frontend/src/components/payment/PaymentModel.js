import React, { useState } from 'react';
import { apiService } from '../../services/api';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('initiate'); // 'initiate' or 'confirm'
  const [paymentData, setPaymentData] = useState(null);

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.initiatePayment({
        booking_id: booking.id,
        phone_number: phoneNumber
      });
      
      setPaymentData(response.data);
      setStep('confirm');
      // In real app, you'd wait for M-Pesa prompt and user confirmation
    } catch (error) {
      alert('Payment initiation failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      await apiService.confirmPayment({
        payment_id: paymentData.payment_id,
        mpesa_receipt: `MPESA${Date.now()}` // Simulated receipt
      });
      
      onSuccess();
      alert('Payment completed successfully!');
      onClose();
    } catch (error) {
      alert('Payment confirmation failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="payment-content">
          {step === 'initiate' && (
            <form onSubmit={handleInitiatePayment}>
              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-item">
                  <span>Service:</span>
                  <span>{booking.service_title}</span>
                </div>
                <div className="summary-item">
                  <span>Total Amount:</span>
                  <span className="amount">KSh {booking.total_price}</span>
                </div>
                <div className="summary-item commission">
                  <span>Platform Fee (10%):</span>
                  <span>KSh {(booking.total_price * 0.10).toFixed(2)}</span>
                </div>
                <div className="summary-item seller-amount">
                  <span>Provider Receives:</span>
                  <span>KSh {(booking.total_price * 0.90).toFixed(2)}</span>
                </div>
              </div>

              <div className="form-group">
                <label>M-Pesa Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., 254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <small>Ensure this number is registered with M-Pesa</small>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Initiating Payment...' : 'Pay with M-Pesa'}
              </button>
            </form>
          )}

          {step === 'confirm' && paymentData && (
            <div className="confirmation-step">
              <div className="success-icon">✓</div>
              <h3>Payment Initiated Successfully!</h3>
              <p>You should receive an M-Pesa prompt on {phoneNumber}</p>
              
              <div className="payment-details">
                <div className="detail-item">
                  <span>Amount:</span>
                  <span>KSh {paymentData.amount}</span>
                </div>
                <div className="detail-item">
                  <span>Platform Fee:</span>
                  <span>KSh {paymentData.commission}</span>
                </div>
                <div className="detail-item">
                  <span>Provider Gets:</span>
                  <span>KSh {paymentData.seller_amount}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmPayment} 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Confirming...' : 'I have paid - Confirm'}
              </button>
              
              <p className="note">
                Note: Funds are held securely until service completion
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;