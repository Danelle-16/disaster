# NASA EONET API v3 Integration Guide

## Overview

The Disaster Alert app uses NASA's EONET (Earth Observation Natural Event Tracking) API v3 to fetch real-time global disaster data.

**API Documentation**: https://eonet.gsfc.nasa.gov/
**Version**: v3 (Latest)
**Base URL**: https://eonet.gsfc.nasa.gov/api/v3

## Getting Your API Key

1. Visit https://eonet.gsfc.nasa.gov/
2. Sign up for a free account (optional but recommended)
3. Your API key will be provided
4. Add it to your `.env` file:
   ```
   NASA_API_KEY=your_key_here
   ```

## Environment Configuration

All EONET endpoints are configured in `.env`:

```env
# EONET API v3 Endpoints
EONET_BASE_URL=https://eonet.gsfc.nasa.gov/api/v3
EONET_EVENTS_URL=https://eonet.gsfc.nasa.gov/api/v3/events
EONET_EVENTS_GEOJSON_URL=https://eonet.gsfc.nasa.gov/api/v3/events/geojson
EONET_CATEGORIES_URL=https://eonet.gsfc.nasa.gov/api/v3/categories
EONET_LAYERS_URL=https://eonet.gsfc.nasa.gov/api/v3/layers

# Query Parameter Defaults
EONET_DEFAULT_STATUS=open      # open, closed, all
EONET_DEFAULT_LIMIT=500        # Max events per request
EONET_DEFAULT_DAYS=30          # Days of history to check
```

## API Endpoints

### 1. Events Endpoint
```
GET https://eonet.gsfc.nasa.gov/api/v3/events
```

Fetch events in standard JSON format.

**Query Parameters**:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `api_key` | string | Your NASA API key | `api_key=xxx` |
| `status` | string | `open` \| `closed` \| `all` | `status=open` |
| `category` | string | Category ID (comma-separated for multiple) | `category=wildfires` |
| `source` | string | Source ID (comma-separated for multiple) | `source=InciWeb` |
| `limit` | integer | Max events to return (default: 20, max: 500) | `limit=100` |
| `days` | integer | Past N days to include (default: all) | `days=30` |
| `start` | date | Start date in YYYY-MM-DD format | `start=2024-01-01` |
| `end` | date | End date in YYYY-MM-DD format | `end=2024-12-31` |
| `bbox` | coordinates | Bounding box: `minLon,maxLat,maxLon,minLat` | `bbox=-129,50,-58,12` |
| `magID` | string | Magnitude ID | `magID=mag_kts` |
| `magMin` | float | Minimum magnitude | `magMin=5.5` |
| `magMax` | float | Maximum magnitude | `magMax=7.0` |

**Example Requests**:

```bash
# Get all open wildfire events from past 30 days
curl "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires&days=30"

# Get recent severe storms with limit
curl "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=severeStorms&limit=50"

# Get events from specific date range
curl "https://eonet.gsfc.nasa.gov/api/v3/events?start=2024-01-01&end=2024-01-31&limit=100"

# Get events in geographic bounding box (California area)
curl "https://eonet.gsfc.nasa.gov/api/v3/events?bbox=-125,42,-114,32&limit=50"

# Get events from specific source
curl "https://eonet.gsfc.nasa.gov/api/v3/events?source=InciWeb&status=open"
```

**Response Format**:

```json
{
  "title": "EONET Events",
  "description": "Natural events...",
  "link": "https://eonet.gsfc.nasa.gov/api/v3/events",
  "events": [
    {
      "id": "EONET_5847",
      "title": "California Wildfire",
      "description": "Active wildfire in Northern California",
      "link": "https://eonet.gsfc.nasa.gov/api/v3/events/EONET_5847",
      "closed": null,
      "categories": [
        {
          "id": 8,
          "title": "Wildfires"
        }
      ],
      "sources": [
        {
          "id": "InciWeb",
          "title": "InciWeb"
        }
      ],
      "geometry": [
        {
          "magnitudeValue": null,
          "magnitudeUnit": null,
          "date": "2024-01-15T00:00:00Z",
          "type": "Point",
          "coordinates": [-120.5, 39.8]
        }
      ]
    }
  ]
}
```

### 2. Events GeoJSON Endpoint
```
GET https://eonet.gsfc.nasa.gov/api/v3/events/geojson
```

Fetch events in GeoJSON format (better for mapping).

**Query Parameters**: Same as Events endpoint

**Example Requests**:

```bash
# Get wildfires as GeoJSON
curl "https://eonet.gsfc.nasa.gov/api/v3/events/geojson?category=wildfires&status=open"

# Get recent events as GeoJSON
curl "https://eonet.gsfc.nasa.gov/api/v3/events/geojson?days=7&limit=100"
```

**Response Format**:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-120.5, 39.8]
      },
      "properties": {
        "id": "EONET_5847",
        "title": "California Wildfire",
        "category": "Wildfires",
        "date": "2024-01-15T00:00:00Z",
        "closed": null
      }
    }
  ]
}
```

### 3. Categories Endpoint
```
GET https://eonet.gsfc.nasa.gov/api/v3/categories
GET https://eonet.gsfc.nasa.gov/api/v3/categories/{categoryId}
```

Get available event categories.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `api_key` | string | Your NASA API key |
| `source` | string | Filter by source (comma-separated) |

**Available Categories**:

| Category ID | Title | Description |
|-------------|-------|-------------|
| `wildfires` | Wildfires | Uncontrolled fire |
| `floods` | Floods | Inundation of water on normally dry land |
| `severeStorms` | Severe Storms | Severe weather events |
| `volcanoes` | Volcanoes | Volcanic eruption |
| `earthquakes` | Earthquakes | Shaking of the earth's surface |
| `droughts` | Droughts | Prolonged abnormally low rainfall |
| `dustHaze` | Dust and Haze | Dust or Haze Event |
| `manmade` | Manmade | Manmade Event |
| `seaLakeIce` | Sea and Lake Ice | Ice event |
| `landslides` | Landslides | Earth sliding down a slope |

**Example Requests**:

```bash
# Get all categories
curl "https://eonet.gsfc.nasa.gov/api/v3/categories"

# Get specific category
curl "https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires"

# Get categories by source
curl "https://eonet.gsfc.nasa.gov/api/v3/categories?source=InciWeb,EO"
```

**Response Format**:

```json
{
  "title": "EONET Categories",
  "description": "Categories for EONET Events",
  "link": "https://eonet.gsfc.nasa.gov/api/v3/categories",
  "categories": [
    {
      "id": 8,
      "title": "Wildfires",
      "description": "Uncontrolled fires...",
      "link": "https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires",
      "layers": "https://eonet.gsfc.nasa.gov/api/v3/layers/wildfires"
    }
  ]
}
```

### 4. Layers Endpoint
```
GET https://eonet.gsfc.nasa.gov/api/v3/layers
GET https://eonet.gsfc.nasa.gov/api/v3/layers/{categoryId}
```

Get satellite imagery layers for visualization.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `api_key` | string | Your NASA API key |

**Example Requests**:

```bash
# Get all available layers
curl "https://eonet.gsfc.nasa.gov/api/v3/layers"

# Get layers for specific category
curl "https://eonet.gsfc.nasa.gov/api/v3/layers/wildfires"
```

**Response Format**:

```json
{
  "title": "EONET Layers",
  "description": "EONET Imagery Layers",
  "link": "https://eonet.gsfc.nasa.gov/api/v3/layers",
  "layers": [
    {
      "name": "MODIS Corrected Reflectance (True Color)",
      "serviceUrl": "https://map1.vis.earthdata.nasa.gov/...",
      "serviceTypeId": "WMTS",
      "parameters": []
    }
  ]
}
```

## Backend Usage Examples

### Using the EONETService in Your Code

```python
from eonet_service import EONETService

# Initialize service
eonet = EONETService()

# Fetch all open wildfire events
wildfires = eonet.fetch_events(category='wildfires', status='open')

# Fetch events as GeoJSON for mapping
geojson_events = eonet.fetch_events_geojson(status='open', limit=100)

# Get categories
categories = eonet.fetch_categories()

# Get category-specific events
category_events = eonet.fetch_category_events('wildfires', status='open')

# Get satellite layers
layers = eonet.fetch_layers(category='wildfires')

# Sync all events to database
new_count = eonet.sync_events()
```

## API Calling Patterns

### Pattern 1: Get Recent Open Disasters
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=100"
```

### Pattern 2: Get Events by Category and Date Range
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&start=2024-01-01&end=2024-12-31"
```

### Pattern 3: Get Events in Geographic Region
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?bbox=-129,50,-58,12"
```

### Pattern 4: Get Specific Source Events
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?source=InciWeb&status=open"
```

### Pattern 5: Get Events with Magnitude Filter (Earthquakes)
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?magID=mag_us&magMin=5.5&magMax=7.0"
```

## Rate Limiting

- **No rate limits** specified for EONET API v3
- Recommended: 1 request per minute per resource to be respectful
- Consider batching requests

## Field Mapping

How EONET API v3 fields map to Disaster Alert database:

| EONET Field | Disaster Alert Field | Transformation |
|-------------|----------------------|-----------------|
| `id` | Event.id | Direct |
| `title` | Event.title | Direct |
| `description` | Event.description | Direct |
| `categories[0].title` | Event.category | Mapped to simplified category |
| `geometry[-1].coordinates` | Event.latitude, Event.longitude | coordinates[1], coordinates[0] |
| `geometry[-1].date` | Event.date | Parsed to datetime |
| `closed` | Event.status, Event.closed_date | null → 'open', date → 'closed' |
| `sources[0].url` | Event.source_url | Direct |
| Event sources count | Event.severity | Heuristic (more sources = higher severity) |

## Error Handling

The EONET service includes error handling for:

- Network timeouts (10 second limit)
- Invalid JSON responses
- Missing required parameters
- HTTP errors

Example error handling:

```python
try:
    events = eonet.fetch_events(category='wildfires')
except requests.exceptions.RequestException as e:
    logger.error(f"API request failed: {e}")
    return []
```

## Caching Strategy

For optimal performance:

```python
# Cache events for 5 minutes
CACHE_DURATION = 5 * 60  # seconds

# Sync events periodically
# Every 5-10 minutes for real-time updates
```

## Common Use Cases

### 1. Real-time Disaster Monitoring
```python
# Get all open events
events = eonet.fetch_events(status='open', limit=500)
```

### 2. Historical Analysis
```python
# Get events from past 90 days
events = eonet.fetch_events(days=90, status='all')
```

### 3. Geographic Monitoring
```python
# Get earthquakes in specific region
events = eonet.fetch_events(
    bbox=-125,42,-114,32,  # California area
    category='earthquakes'
)
```

### 4. Category-Specific Alerts
```python
# Get high-activity wildfires
wildfires = eonet.fetch_events(
    category='wildfires',
    status='open',
    limit=100
)
```

## Sources Available

The API supports filtering by various sources:

- **InciWeb** - Incident Information System for Wildland Fire
- **EO** - Earth Observatory
- **NOAA** - National Oceanic and Atmospheric Administration
- **USGS** - United States Geological Survey
- And many others...

Query multiple sources:
```bash
curl "https://eonet.gsfc.nasa.gov/api/v3/events?source=InciWeb,EO,USGS"
```

## Troubleshooting

### Issue: API returns 401 Unauthorized
**Solution**: Verify your API key is correct and included in requests

### Issue: Empty events array
**Solution**: 
- Check status parameter (default is 'open')
- Try with `status=all` to see closed events
- Increase `days` parameter

### Issue: Timeout errors
**Solution**:
- Reduce `limit` parameter
- Use more specific category/source filters
- Implement retry logic with exponential backoff

### Issue: No GeoJSON features
**Solution**: 
- Use `/events/geojson` endpoint instead of `/events`
- Check category spelling matches available categories

## API Documentation

For complete and up-to-date information:
- **Official NASA EONET**: https://eonet.gsfc.nasa.gov/
- **API v3 Changelog**: https://eonet.gsfc.nasa.gov/api/v3/changes
- **How-to Guides**: https://eonet.gsfc.nasa.gov/how-tos

## Version History

- **v3** (Current) - Latest version with enhanced filters
- **v2.1** (Deprecated) - Old version, still available but avoid
- **v2** (Removed) - No longer available

---

**Last Updated**: May 2, 2026
**EONET API Version**: v3
