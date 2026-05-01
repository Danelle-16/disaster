import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SettingsPage() {
  const [location, setLocation] = useState({ latitude: '', longitude: '', city: '', country: '' });
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchLocation();
    fetchPreferences();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get('/api/user/location', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocation(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('/api/user/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const saveLocation = async () => {
    setLoading(true);
    try {
      await axios.post('/api/user/location', location, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Location saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving location');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ ...location, latitude: latitude.toFixed(4), longitude: longitude.toFixed(4) });
          await saveLocation();
        },
        (error) => setMessage('Error detecting location: ' + error.message)
      );
    }
  };

  return (
    <div className="main-content">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Settings */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">📍 Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={location.latitude}
                  onChange={handleLocationChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={location.longitude}
                  onChange={handleLocationChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={location.city}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={location.country}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={detectLocation}
                className="w-full btn btn-secondary"
              >
                📍 Auto-detect Location
              </button>

              <button
                onClick={saveLocation}
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">🔔 Alert Preferences</h2>
            
            <div className="space-y-4">
              {preferences.length === 0 ? (
                <p className="text-gray-600">No preferences set yet</p>
              ) : (
                preferences.map((pref) => (
                  <div key={pref.id} className="p-3 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold capitalize mb-2">{pref.category}</h3>
                    <p className="text-sm text-gray-600">
                      Radius: {pref.radius} km | Severity: {pref.severity_threshold || 'All'}
                    </p>
                    <p className={`text-sm ${pref.alert_enabled ? 'text-green-600' : 'text-red-600'}`}>
                      {pref.alert_enabled ? '✓ Enabled' : '✗ Disabled'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
