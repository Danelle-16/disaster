import React from 'react';

function EventList({ events }) {
  const getCategoryEmoji = (category) => {
    const emojis = {
      wildfire: '🔥',
      flood: '🌊',
      storm: '🌪️',
      volcano: '🌋',
      earthquake: '📍',
      drought: '🏜️',
      dust: '💨',
      other: '⚠️'
    };
    return emojis[category] || '⚠️';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No events found</p>
      ) : (
        events.map((event) => (
          <div 
            key={event.id}
            className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer bg-gray-50"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xl">{getCategoryEmoji(event.category)}</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {event.title}
                </h4>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <span className={`badge ${getSeverityColor(event.severity)}`}>
                {event.severity?.toUpperCase() || 'UNKNOWN'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventList;
