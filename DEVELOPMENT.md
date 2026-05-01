# Development Guide

## Prerequisites

- Python 3.9+
- Node.js 16+
- Docker & Docker Compose
- Git

## Local Development Setup

### Backend Setup

1. **Clone Repository**
   ```bash
   cd disaster-alert/backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

5. **Setup Database** (using Docker)
   ```bash
   # In a separate terminal
   docker run -d \
     --name disaster-mysql \
     -e MYSQL_ROOT_PASSWORD=root \
     -e MYSQL_DATABASE=disaster_alert \
     -e MYSQL_USER=disaster_user \
     -e MYSQL_PASSWORD=disaster_password \
     -p 3306:3306 \
     mysql:8.0
   ```

6. **Update .env**
   ```
   DB_HOST=127.0.0.1
   DB_USER=disaster_user
   DB_PASSWORD=disaster_password
   NASA_API_KEY=your_api_key_here
   ```

7. **Run Backend**
   ```bash
   python main.py
   ```

   Backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd disaster-alert/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

   Frontend will be available at `http://localhost:3000`

## Development Workflow

### Making Changes

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Backend Changes**
   ```bash
   # Edit files in backend/
   # Backend auto-reloads on changes
   
   # Add new endpoint example:
   @app.route('/api/example', methods=['GET'])
   def example():
       return jsonify({'message': 'example'}), 200
   ```

3. **Frontend Changes**
   ```bash
   # Edit files in frontend/src
   # Frontend hot-reloads on changes
   
   # Add new component example:
   function NewComponent() {
     return <div>New Component</div>
   }
   export default NewComponent
   ```

4. **Test Changes**
   ```bash
   # Backend: curl or Postman
   curl http://localhost:8080/api/events
   
   # Frontend: Check browser console
   ```

## API Testing

### Using curl

```bash
# Get events
curl http://localhost:8080/api/events

# Get events with filters
curl "http://localhost:8080/api/events?category=wildfire&status=open"

# Get analytics
curl http://localhost:8080/api/events/analytics

# Health check
curl http://localhost:8080/health
```

### Using Postman

1. Import API collection from `API_DOCUMENTATION.md`
2. Set environment variables
3. Test endpoints

### Using Python

```python
import requests

# Get events
response = requests.get('http://localhost:8080/api/events')
print(response.json())

# Register user
response = requests.post('http://localhost:8080/api/auth/register', json={
    'username': 'testuser',
    'email': 'test@example.com',
    'password': 'password123'
})
print(response.json())
```

## Database Management

### MySQLWorkbench

1. Connect to `localhost:3306`
2. User: `disaster_user`
3. Password: `disaster_password`
4. Database: `disaster_alert`

### MySQL CLI

```bash
# Connect
docker exec -it disaster-mysql mysql -uroot -proot

# Connect to database
mysql -hdisaster-mysql -udisaster_user -pdisaster_password disaster_alert

# Show tables
SHOW TABLES;

# Check events
SELECT * FROM events LIMIT 10;

# Check users
SELECT * FROM users;
```

## Debugging

### Backend Debugging

```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or use logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
logger.error("Error message")
```

### Frontend Debugging

```javascript
// Browser DevTools
console.log('Debug:', variable);
debugger; // Sets breakpoint

// React DevTools Extension
// Redux DevTools (if using Redux)
```

### Docker Debugging

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Connect to container
docker exec -it disaster-alert-backend bash
docker exec -it disaster-mysql bash
```

## Testing

### Backend Unit Tests (Template)

```python
# test_backend.py
import unittest
from main import app
from models import db, Event

class TestEvents(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
    
    def test_get_events(self):
        response = self.app.get('/api/events')
        self.assertEqual(response.status_code, 200)
    
    def test_health_check(self):
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
```

### Frontend Unit Tests (Template)

```javascript
// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app component', () => {
  render(<App />);
  expect(screen.getByText(/Disaster Alert/i)).toBeInTheDocument();
});
```

## Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up --build

# Rebuild specific service
docker-compose build --no-cache backend

# Run specific service
docker-compose up backend

# Access logs
docker-compose logs -f service_name

# Stop services
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

### Building Images Manually

```bash
# Backend
docker build -t disaster-backend:dev backend/

# Frontend
docker build -t disaster-frontend:dev frontend/

# Run containers
docker run -p 8080:8080 disaster-backend:dev
docker run -p 3000:3000 disaster-frontend:dev
```

## Code Style

### Backend (Python)

```python
# Follow PEP 8
# Use type hints
# Keep functions small and focused

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in km"""
    # implementation
    pass
```

### Frontend (JavaScript/React)

```javascript
// Use functional components
// Use hooks
// Meaningful component/variable names

function EventCard({ event }) {
  return <div>{event.title}</div>
}

export default EventCard
```

## Environment Variables Reference

### Backend .env
```
FLASK_ENV=development
SECRET_KEY=dev-secret
DB_HOST=localhost
DB_USER=disaster_user
DB_PASSWORD=disaster_password
NASA_API_KEY=your_key
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:8080
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Linux/Mac - Find process on port
lsof -i :8080

# Kill process
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### MySQL Connection Error
```bash
# Check if MySQL is running
docker ps | grep mysql

# Restart MySQL
docker restart disaster-mysql

# Check logs
docker logs disaster-mysql
```

### React App Not Loading
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start fresh
npm start
```

### API CORS Issues
```javascript
// Check CORS settings in backend config.py
# Update CORS_ORIGINS with frontend URL
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes
git add .

# Commit
git commit -m "feat: Add amazing feature"

# Push to remote
git push origin feature/amazing-feature

# Create Pull Request on GitHub
```

## Performance Monitoring

### Backend Performance
```python
# Use Flask profiling
from flask_profiler import Profiler

profiler = Profiler()
profiler.init_app(app)
```

### Frontend Performance
```javascript
// Use React DevTools Profiler
// Check Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getTTFB(console.log);
```

## Documentation

### Generate Backend Docs
```bash
# Using Sphinx
pip install sphinx
sphinx-quickstart docs
```

### API Documentation
See `API_DOCUMENTATION.md`

## Useful Commands Summary

```bash
# Backend
python main.py                    # Run backend
pip install -r requirements.txt   # Install deps
python -m pytest                  # Run tests

# Frontend
npm start                         # Start dev server
npm run build                     # Build for production
npm test                          # Run tests

# Docker
docker-compose up --build         # Start all services
docker-compose logs -f            # View all logs
docker-compose down               # Stop services

# Database
mysql -h localhost -u root -p     # Connect to MySQL
```

## Need Help?

- Check existing issues on GitHub
- Review API documentation
- Check application logs
- Ask in discussions
