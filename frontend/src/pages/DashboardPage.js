import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Events</h3>
              <p className="text-4xl font-bold text-blue-600">{analytics.total_events}</p>
            </div>

            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Open Events</h3>
              <p className="text-4xl font-bold text-orange-600">{analytics.total_open}</p>
            </div>

            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Recent (7 days)</h3>
              <p className="text-4xl font-bold text-red-600">{analytics.recent_events_7days}</p>
            </div>

            <div className="card">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Categories</h3>
              <p className="text-4xl font-bold text-purple-600">
                {Object.keys(analytics.by_category).length}
              </p>
            </div>
          </div>
        ) : null}

        {/* Category Breakdown */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Events by Category</h2>
              <div className="space-y-3">
                {Object.entries(analytics.by_category).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center pb-2 border-b">
                    <span className="capitalize font-medium">{cat}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Events by Status</h2>
              <div className="space-y-3">
                {Object.entries(analytics.by_status).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center pb-2 border-b">
                    <span className="capitalize font-medium">{status}</span>
                    <span className={`${
                      status === 'open' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    } px-3 py-1 rounded-full text-sm font-semibold`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
