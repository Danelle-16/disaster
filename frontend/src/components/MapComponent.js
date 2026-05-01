import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const categoryIcons = {
  wildfire: { emoji: '🔥', color: '#ef4444' },
  flood: { emoji: '🌊', color: '#3b82f6' },
  storm: { emoji: '🌪️', color: '#8b5cf6' },
  volcano: { emoji: '🌋', color: '#f97316' },
  earthquake: { emoji: '📍', color: '#dc2626' },
  drought: { emoji: '🏜️', color: '#eab308' },
  dust: { emoji: '💨', color: '#78716c' },
  other: { emoji: '⚠️', color: '#6366f1' }
};

function MapComponent({ events }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add event markers
    events.forEach((event) => {
      const icon = categoryIcons[event.category] || categoryIcons.other;
      
      const customIcon = L.divIcon({
        html: `<div style="font-size: 28px; line-height: 1;">${icon.emoji}</div>`,
        iconSize: [28, 28],
        className: 'custom-marker'
      });

      const marker = L.marker([event.latitude, event.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="popup">
            <h3 class="font-bold">${event.title}</h3>
            <p class="text-sm text-gray-600">${event.category.toUpperCase()}</p>
            <p class="text-sm">${new Date(event.date).toLocaleDateString()}</p>
            <p class="text-sm font-semibold text-${event.severity === 'critical' ? 'red' : event.severity === 'high' ? 'orange' : 'yellow'}-600">
              ${event.severity?.toUpperCase() || 'Unknown'}
            </p>
          </div>
        `)
        .addTo(map);
    });

    // Auto-fit bounds if events exist
    if (events.length > 0) {
      const group = new L.featureGroup(
        events.map(e => L.marker([e.latitude, e.longitude]))
      );
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

  }, [events]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}

export default MapComponent;
