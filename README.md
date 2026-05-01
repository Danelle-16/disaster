# Disaster Alert Web App 🌍

A responsive web application that displays live global disasters, sends browser alerts, and provides advanced analytics and filtering capabilities powered by NASA's EONET API v3.

## 📋 Features

### Core Features
- **🗺️ Live Interactive Map** - Real-time disaster event markers with color-coding
- **🔔 Browser Notifications** - Instant alerts for events near your location
- **📊 Dashboard & Analytics** - Event statistics and trends visualization
- **🎯 Smart Filtering** - Filter by category, status, date range, and distance
- **📍 Location Detection** - Auto-detect or manually set your location
- **👤 User Accounts** - Save preferences, customize alerts, track favorites

### Event Types
- 🔥 Wildfires
- 🌊 Floods  
- 🌪️ Storms
- 🌋 Volcanoes
- & More from EONET API

## 🏗️ Tech Stack

### Backend
- **Framework**: Python Flask + Flask-RESTful
- **Database**: MySQL 8.0
- **API**: NASA EONET API v3
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Docker + Docker Compose

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js
- **HTTP**: Axios
- **PWA**: Progressive Web App (installable, offline support)

### Infrastructure
- Docker & Docker Compose for containerization
- Nginx for production serving
- Multi-stage builds for optimized images

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- NASA EONET API key ([Get one here](https://eonet.gsfc.nasa.gov/))

### Setup

1. **Clone & Navigate**
   ```bash
   cd disaster-alert
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your NASA API key
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```


## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user, get JWT token

### Events
- `GET /api/events` - Fetch all events with filters
- `GET /api/events/<id>` - Get single event details
- `GET /api/events/nearby?lat=X&lon=Y&radius=50` - Events near coordinates
- `GET /api/events/analytics` - Event statistics & trends

### User Management (Requires JWT)
- `GET /api/user/location` - Fetch user location
- `POST /api/user/location` - Set user location
- `GET /api/user/preferences` - Fetch alert preferences
- `POST /api/user/preferences` - Create/update preferences
- `DELETE /api/user/preferences/<id>` - Delete preference

### Admin
- `POST /api/admin/sync-events` - Manually sync events from NASA

## 🗂️ Project Structure

```
disaster-alert/
├── backend/                 # Flask backend
│   ├── main.py             # Main Flask app
│   ├── config.py           # Configuration
│   ├── models.py           # Database models
│   ├── eonet_service.py    # NASA API integration
│   ├── alert_engine.py     # Alert logic
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js          # Main app component
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API service layer
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   ├── Dockerfile          # Frontend container
│   └── nginx.conf          # Production serving
│
├── docker-compose.yml      # Container orchestration
├── .env.example            # Environment template
└── README.md              # This file
```

## 🔧 Configuration

### NASA API Key
1. Get free API key from [NASA EONET](https://eonet.gsfc.nasa.gov/)
2. Add to `.env` file:
   ```
   NASA_API_KEY=your_key_here
   ```

### Database
Configured automatically in `docker-compose.yml`:
- User: `disaster_user`
- Password: `disaster_password`
- Database: `disaster_alert`

### JWT Secret
Change these in production `.env`:
```
SECRET_KEY=generate-secure-random-string
JWT_SECRET_KEY=generate-secure-random-string
```

## 📱 Features Deep Dive

### Live Map
- Interactive Leaflet map with color-coded event markers
- Click markers for event details
- Zoom & pan controls
- Auto-clustering for many events

### Alert System
- Distance-based notifications (customizable radius)
- Severity thresholds (low, medium, high, critical)
- Category-specific preferences
- Browser push notifications (PWA)

### Dashboard Analytics  
- Events by category pie chart
- Event trends over time
- Top affected regions
- Statistics & KPIs

### User Preferences
- Save multiple alert categories
- Set custom alert radius per category
- Enable/disable alerts per event type
- Auto-detect or manual location entry

## 🧪 Database Schema

### Events Table
- Event ID, title, category, status
- Latitude, longitude, timestamp
- Severity level, source URL
- Geometry data for mapping

### Users Table
- Username, email, password hash
- Location coordinates & geo info
- Account creation timestamp

### UserPreferences Table
- Alert category & radius
- Severity threshold
- Enable/disable toggle
- Unique constraint: user_id + category

### Alerts Table
- User & event reference
- Alert type (push, email, in-app)
- Sent timestamp & read status

## 🔐 Security

- ✅ HTTPS-ready (configure in production)
- ✅ JWT token authentication
- ✅ Password hashing (Werkzeug)
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Secure environment variables

## 📦 Deployment

### Production Checklist
- [ ] Change `SECRET_KEY` and `JWT_SECRET_KEY` in `.env`
- [ ] Set `FLASK_ENV=production`
- [ ] Use strong database password
- [ ] Configure HTTPS/SSL
- [ ] Update allowed origins in CORS
- [ ] Run database migrations
- [ ] Set up monitoring & logging
- [ ] Configure backups

### Docker Production
```bash
# Build images
docker-compose -f docker-compose.yml build

# Run with environment file
docker-compose --env-file .env.production up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check database is running
docker-compose logs db

# Verify credentials in .env
# Wait for MySQL health check
```

### API Returns 404
```bash
# Ensure backend is running
docker-compose logs backend

# Check backend health
curl http://localhost:8080/health
```

### Map Not Loading
```bash
# Check browser console for errors
# Verify Leaflet CSS/JS loaded
# Check API CORS settings
```

## 🚦 Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
export FLASK_ENV=development
python main.py
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## 📈 Future Enhancements

- 🤖 **AI Predictions** - ML-based event predictions
- 📡 **Satellite Imagery** - Overlay satellite imagery on map
- 🗣️ **Multi-language** - Support for multiple languages
- 📞 **SMS Alerts** - Text message notifications
- 🌐 **Global Heatmap** - Risk visualization
- 📊 **Advanced Analytics** - Trend analysis & forecasting
- 🔄 **Real-time Updates** - WebSocket support
- 🛰️ **Satellite Integration** - Live satellite feeds

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Check existing documentation
- Review API documentation

## 🙏 Credits

- **NASA EONET API** - Real-time disaster data
- **OpenStreetMap** - Map tiles
- **Leaflet.js** - Interactive mapping
- **React** - Frontend framework
- **Flask** - Backend framework

---

Built with ❤️ for disaster awareness and safety
