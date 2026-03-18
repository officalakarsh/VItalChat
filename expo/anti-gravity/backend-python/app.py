import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import googlemaps
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../backend-php/config/.env')

app = Flask(__name__)
# Enable CORS for the Netlify frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Google Maps Client
GMAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
if GMAPS_API_KEY and GMAPS_API_KEY != 'YOUR_GOOGLE_MAPS_API_KEY':
    gmaps = googlemaps.Client(key=GMAPS_API_KEY)
else:
    gmaps = None

# Mock symptom database to map text inputs to specialties
SYMPTOM_MAP = {
    'fever': 'General Physician',
    'sore throat': 'General Physician',
    'headache': 'General Physician',
    'toothache': 'Dentist',
    'teeth': 'Dentist',
    'chest pain': 'Cardiologist',
    'heart': 'Cardiologist',
    'stomach': 'Gastroenterologist',
    'bone': 'Orthopedist',
    'fracture': 'Orthopedist',
    'skin': 'Dermatologist',
    'rash': 'Dermatologist'
}

def analyze_symptoms(text):
    text_lower = text.lower()
    for keyword, specialty in SYMPTOM_MAP.items():
        if keyword in text_lower:
            return specialty
    return 'General Physician' # Default fallback

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    session_state = data.get('state', 'start')
    
    if session_state == 'start':
        symptoms = data.get('symptoms', '')
        specialty = analyze_symptoms(symptoms)
        
        return jsonify({
            "message": f"Based on your symptoms, I recommend seeing a {specialty}.",
            "specialty": specialty,
            "next_step": "request_location"
        })
        
    elif session_state == 'find_clinics':
        # Requires gmaps setup to function fully
        if not gmaps:
            return jsonify({
                "message": "Demo Mode: Found Top Clinics near you:",
                "clinics": [
                    {"name": "Jaipur City Hospital", "distance": "1.2 km", "address": "M.I Road, Jaipur"},
                    {"name": "Careway Clinic", "distance": "2.5 km", "address": "Vaishali Nagar, Jaipur"}
                ]
            })
            
        lat = data.get('lat')
        lng = data.get('lng')
        specialty = data.get('specialty', 'hospital')
        
        if not lat or not lng:
            return jsonify({"error": "Location data required"}), 400
            
        try:
            # Search Google Places API
            places_result = gmaps.places_nearby(
                location=(lat, lng),
                radius=5000,
                keyword=specialty,
                type='hospital'
            )
            
            clinics = []
            for place in places_result.get('results', [])[:3]:
                clinics.append({
                    "name": place.get('name'),
                    "address": place.get('vicinity'),
                    "rating": place.get('rating', 'N/A')
                })
                
            return jsonify({
                "message": f"I found some highly-rated {specialty} facilities near you:",
                "clinics": clinics
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
