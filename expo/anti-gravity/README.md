# Vital Chat Health Portal

Vital Chat is a fully responsive web platform enabling patients to discover nearby clinics and hospitals, book appointments online, and get AI-powered assistance for locating the right care based on their symptoms and real-time location.

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend API**: PHP 8, MySQL
- **AI Chatbot API**: Python 3 (Flask)
- **Maps**: Google Maps JS API, Places API, Distance Matrix API, Geocoding API, Geolocation API
- **Deployment**: Netlify (Frontend), Render/Railway (Python Backend), VPS/PlanetScale (PHP & MySQL DB)

## Folder Structure
```
anti-gravity/
├── frontend/             # HTML, CSS, JS hosted on Netlify
├── backend-php/          # REST APIs and Database config
├── backend-python/       # AI Chatbot logic and Google API integrations
├── database/             # MySQL schema and seed data
```

## Setup Instructions
1. Clone the repository.
2. Import `database/schema.sql` into your MySQL instance.
3. Configure `backend-php/config/.env` with your DB credentials.
4. Set up the Python virtual environment and install dependencies: `pip install -r backend-python/requirements.txt`.
5. Run the localized PHP server and Python Flask application.
