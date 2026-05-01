import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span>🌍</span>
          Disaster Alert
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
              <Link to="/settings" className="hover:text-blue-200 transition">Settings</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
