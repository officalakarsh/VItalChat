document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Geolocation button setup
    const geoBtn = document.querySelector('.geo-btn');
    const locationInput = document.querySelector('input[name="location"]');
    if (geoBtn && locationInput) {
        geoBtn.addEventListener('click', () => {
            geoBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i>";
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        // For a real app, you'd reverse geocode here using Google Maps API
                        locationInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                        geoBtn.innerHTML = "<i class='bx bx-check-circle' style='color: var(--primary);'></i>";
                    },
                    (error) => {
                        alert("Could not detect location. Please type it in manually.");
                        geoBtn.innerHTML = "<i class='bx bx-current-location'></i>";
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
                geoBtn.innerHTML = "<i class='bx bx-current-location'></i>";
            }
        });
    }

    // Connect Chatbot UI
    const triggerBtn = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const heroAiTrigger = document.getElementById('hero-ai-trigger');

    function openChat() {
        if(chatWindow && !chatWindow.classList.contains('active')){
            chatWindow.classList.add('active');
            chatWindow.animate([
                { transform: 'scale(0.8) translateY(20px)', opacity: 0 },
                { transform: 'scale(1) translateY(0)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
        }
    }

    function closeChat() {
        if(chatWindow && chatWindow.classList.contains('active')){
            chatWindow.classList.remove('active');
            triggerBtn.style.animationPlayState = 'running'; // Resume bounce
        }
    }

    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            if (chatWindow.classList.contains('active')) {
                closeChat();
            } else {
                openChat();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    if (heroAiTrigger) {
        heroAiTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openChat();
        });
    }
});

// Initialize Google Map for Jaipur
window.initMap = function() {
    const jaipur = { lat: 26.9124, lng: 75.7873 };
    const mapElement = document.getElementById('jaipur-map');
    
    if (mapElement && window.google) {
        const map = new google.maps.Map(mapElement, {
            zoom: 12,
            center: jaipur,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{"weight": "2.00"}]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#9c9c9c"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100},{"lightness": 45}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#e0f2fe"},{"visibility": "on"}]
                }
            ]
        });

        // Add a marker for center of Jaipur
        new google.maps.Marker({
            position: jaipur,
            map: map,
            title: 'Jaipur'
        });
    }
};
