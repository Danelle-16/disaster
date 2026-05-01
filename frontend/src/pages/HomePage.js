import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import FilterPanel from '../components/FilterPanel';
import EventList from '../components/EventList';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'open',
    search: ''
  });

  useEffect(() => {
    fetchEvents();
    // Auto-refresh events every 5 minutes
    const interval = setInterval(fetchEvents, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events', {
        params: {
          status: filters.status,
          category: filters.category !== 'all' ? filters.category : undefined,
          limit: 500
        }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="main-content">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Disaster Map</h1>
          <p className="text-gray-600">Real-time global disaster events from NASA EONET API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="card h-96 lg:h-screen">
              <MapComponent events={filteredEvents} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <FilterPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
              eventCount={filteredEvents.length}
            />
            
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Latest Events</h3>
              <EventList events={filteredEvents.slice(0, 5)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
