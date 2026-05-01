import React from 'react';

function FilterPanel({ filters, onFilterChange, eventCount }) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wildfire', label: '🔥 Wildfires' },
    { value: 'flood', label: '🌊 Floods' },
    { value: 'storm', label: '🌪️ Storms' },
    { value: 'volcano', label: '🌋 Volcanoes' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="open">Open Events</option>
            <option value="closed">Closed Events</option>
            <option value="all">All Events</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search events..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Event Count */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-blue-600">{eventCount}</span> event{eventCount !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
