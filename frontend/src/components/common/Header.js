import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const { user, logout, isProvider } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🛠️ ServiceMarket
        </Link>
        
        <nav className="nav">
          <Link to="/services" className="nav-link">Browse Services</Link>
          
          {user ? (
            <div className="user-menu">
              {isProvider && (
                <Link to="/provider/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}

                <Link to="/completed-bookings" className="nav-link">
                 Pay for Services
                </Link>

              <Link to="/bookings" className="nav-link">My Bookings</Link>
              <span className="user-name">Hello, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">
                Sign Up
              </Link>
            </div>


          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;