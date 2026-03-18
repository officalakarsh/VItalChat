document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('chat-send-btn');
    const inputField = document.getElementById('chat-input-field');
    const messagesContainer = document.getElementById('chatbot-messages');

    // ── Hospital Database (matches appointment.html) ──
    const hospitals = [
        { name: 'Jeevan Rekha Superspeciality Hospital', rating: 4.6, type: 'Hospital', distance: '0.8 km', status: 'Open', phone: '+91 141 4846060', address: 'S24, Central Spine, Mahal Yojana, Jagatpura' },
        { name: 'Aarogyam Hospital', rating: 4.8, type: 'General Hospital', distance: '1.2 km', status: 'Open', phone: '+91 95295 49090', address: 'Aarogyam Hospital Road, Jagatpura' },
        { name: 'Srishti Hospital', rating: 4.9, type: 'Hospital', distance: '1.5 km', status: 'Open', phone: '+91 93762 66610', address: 'F1 & 10, Central Spine, Mahal Rd, Jagatpura' },
        { name: 'Rishab Multispeciality Hospital', rating: 4.6, type: 'Hospital', distance: '2.1 km', status: 'Closed', phone: '+91 92570 43779', address: 'Rishab Hospital Choraha, Vishwa Vidhyalaya Nagar' },
        { name: 'Thakuriya Hospital', rating: 4.9, type: 'Hospital', distance: '2.4 km', status: 'Open', phone: '+91 70140 98701', address: '71, Opp Mahima Panache, Nandpuri B, Jagatpura' },
        { name: 'B L Multispeciality Hospital', rating: 5.0, type: 'Hospital', distance: '2.8 km', status: 'Open', phone: 'Not listed', address: '10A, Near Jagatpura Flyover, Brij Vihar' },
        { name: 'JNU Hospital & Medical College', rating: 3.3, type: 'Hospital', distance: '3.5 km', status: 'Closed', phone: '+91 141 3119000', address: 'Agra–Jaipur Road, Near New RTO Office' },
        { name: 'Patalia Hospital & Research Center', rating: 4.4, type: 'Hospital', distance: '3.9 km', status: 'Open', phone: '+91 98291 92007', address: 'RRMP+V48, Jagatpura' },
        { name: 'DSR Multi Speciality Hospital', rating: 4.3, type: 'Hospital', distance: '4.2 km', status: 'Open', phone: 'Not listed', address: 'Jagatpura Flyover, Railway Colony' },
        { name: 'Bhagwati Ayurveda & Panchakarma Centre', rating: 4.5, type: 'Ayurveda Centre', distance: '3.1 km', status: 'Open', phone: '+91 89053 65005', address: 'A-8, Vinayak Enclave, Near Gyan Vihar University' },
        { name: 'Sadhnani Dental Care', rating: 4.7, type: 'Dental Clinic', distance: '1.9 km', status: 'Open', phone: '+91 98280 57547', address: '43, Model Town, Jagatpura Road' },
        { name: 'Om Skin & Hair Clinic', rating: 4.6, type: 'Skin & Hair Clinic', distance: '2.0 km', status: 'Open', phone: '+91 94142 92920', address: '4-B, Model Town, Jagatpura Road' },
        { name: 'Dr Ashish Rana Clinic', rating: 4.5, type: 'Clinic', distance: '1.6 km', status: 'Open', phone: '+91 91526 15811', address: 'A-106, Ashadeep Green Avenue, Mahal Road' },
        { name: 'Jagatpura Child Care Clinic', rating: 4.4, type: 'Child Care Clinic', distance: '2.3 km', status: 'Open', phone: '+91 94142 33306', address: '21, Ramnagariya Road, Jagatpura' },
        { name: 'City Physiotherapy & Rehab Clinic', rating: 4.3, type: 'Physiotherapy Clinic', distance: '2.5 km', status: 'Open', phone: '+91 98293 87711', address: '8-A, Model Town, Jagatpura Road' },
    ];

    // ── Symptom → Specialty Mapping ──
    const symptomMap = [
        { keywords: ['fever', 'cold', 'cough', 'flu', 'headache', 'body ache', 'fatigue', 'weakness', 'nausea', 'vomit'], specialty: 'General Physician', types: ['Hospital', 'General Hospital', 'Clinic'] },
        { keywords: ['chest pain', 'heart', 'blood pressure', 'bp', 'palpitation', 'cardiac'], specialty: 'Cardiologist', types: ['Hospital', 'General Hospital'] },
        { keywords: ['tooth', 'teeth', 'gum', 'dental', 'cavity', 'mouth'], specialty: 'Dentist', types: ['Dental Clinic', 'Hospital'] },
        { keywords: ['skin', 'rash', 'acne', 'pimple', 'itch', 'allergy', 'eczema', 'hair loss', 'hair fall', 'dandruff'], specialty: 'Dermatologist', types: ['Skin & Hair Clinic', 'Hospital', 'Clinic'] },
        { keywords: ['child', 'baby', 'infant', 'kid', 'pediatric', 'vaccination'], specialty: 'Pediatrician', types: ['Child Care Clinic', 'Hospital', 'General Hospital'] },
        { keywords: ['bone', 'joint', 'fracture', 'knee', 'back pain', 'spine', 'shoulder', 'muscle', 'sprain', 'physiotherapy', 'paralysis'], specialty: 'Orthopedic / Physiotherapist', types: ['Physiotherapy Clinic', 'Hospital'] },
        { keywords: ['stomach', 'digestion', 'gastric', 'acidity', 'diarrhea', 'constipation', 'abdomen', 'liver'], specialty: 'Gastroenterologist', types: ['Hospital', 'General Hospital', 'Clinic'] },
        { keywords: ['eye', 'vision', 'blur', 'cataract'], specialty: 'Ophthalmologist', types: ['Hospital'] },
        { keywords: ['ear', 'nose', 'throat', 'sore throat', 'sinus', 'hearing', 'ent'], specialty: 'ENT Specialist', types: ['Hospital', 'Clinic'] },
        { keywords: ['ayurveda', 'herbal', 'natural', 'panchakarma', 'yoga'], specialty: 'Ayurvedic Practitioner', types: ['Ayurveda Centre', 'Clinic'] },
    ];

    let botState = 'awaiting_symptom';
    let lastSymptoms = '';
    let lastSpecialty = '';

    // ── Utility: style a bot message container ──
    function styleBotMsg(el) {
        el.style.padding = '1rem';
        el.style.borderRadius = 'var(--radius-lg)';
        el.style.marginBottom = '0.5rem';
        el.style.background = 'var(--bg-surface)';
        el.style.color = 'var(--text-primary)';
        el.style.alignSelf = 'flex-start';
        el.style.maxWidth = '85%';
        el.style.boxShadow = 'var(--shadow-sm)';
        el.style.borderBottomLeftRadius = '4px';
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;

        const p = document.createElement('p');
        p.textContent = text;
        msgDiv.appendChild(p);

        msgDiv.style.padding = '1rem';
        msgDiv.style.borderRadius = 'var(--radius-lg)';
        msgDiv.style.marginBottom = '0.5rem';
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.boxShadow = 'var(--shadow-sm)';

        if (sender === 'user') {
            msgDiv.style.background = 'var(--primary)';
            msgDiv.style.color = 'white';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.borderBottomRightRadius = '4px';
        } else {
            msgDiv.style.background = 'var(--bg-surface)';
            msgDiv.style.color = 'var(--text-primary)';
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.borderBottomLeftRadius = '4px';
        }

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ── Match symptoms to a specialty ──
    function matchSpecialty(text) {
        const lower = text.toLowerCase();
        for (const entry of symptomMap) {
            for (const kw of entry.keywords) {
                if (lower.includes(kw)) {
                    return entry;
                }
            }
        }
        // Default fallback
        return { specialty: 'General Physician', types: ['Hospital', 'General Hospital', 'Clinic'] };
    }

    // ── Find matching hospitals (prefer open, sorted by rating) ──
    function findHospitals(types, count = 3) {
        // Score each hospital: matching type + open status + rating
        const scored = hospitals.map(h => {
            let score = 0;
            if (types.includes(h.type)) score += 10;
            if (h.status === 'Open') score += 5;
            score += h.rating;
            return { ...h, score };
        });
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, count);
    }

    // ── Build the appointment booking URL ──
    function buildBookingUrl(hospital) {
        const params = new URLSearchParams();
        params.set('hospital', hospital.name);
        if (lastSpecialty) params.set('specialty', lastSpecialty);
        return `appointment.html?${params.toString()}`;
    }

    // ── Render clinic result cards ──
    function renderClinicCards(clinics) {
        const wrapper = document.createElement('div');
        wrapper.style.alignSelf = 'flex-start';
        wrapper.style.maxWidth = '90%';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '0.6rem';

        clinics.forEach(clinic => {
            const statusColor = clinic.status === 'Open' ? '#16a34a' : '#ef4444';
            const card = document.createElement('div');
            card.style.cssText = `
                background: var(--bg-surface);
                padding: 1rem;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
                transition: transform 0.2s ease;
            `;
            card.onmouseenter = () => { card.style.transform = 'translateY(-2px)'; card.style.boxShadow = 'var(--shadow-md)'; };
            card.onmouseleave = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = 'var(--shadow-sm)'; };

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
                    <h4 style="margin:0; color: var(--primary-dark); font-size:0.95rem;">${clinic.name}</h4>
                    <span style="background:${statusColor}; color:#fff; padding:1px 8px; border-radius:20px; font-size:0.7rem; font-weight:600; white-space:nowrap;">${clinic.status}</span>
                </div>
                <p style="font-size:0.78rem; color: var(--text-secondary); margin:0.15rem 0;">
                    <i class='bx bxs-star' style="color:#facc15; font-size:0.8rem;"></i> ${clinic.rating} &bull; ${clinic.type} &bull; ${clinic.distance} away
                </p>
                <p style="font-size:0.76rem; color: var(--text-muted); margin:0.15rem 0;">
                    <i class='bx bx-map' style="color:var(--primary); font-size:0.8rem;"></i> ${clinic.address}
                </p>
                <p style="font-size:0.76rem; color: var(--text-muted); margin:0.15rem 0 0.5rem;">
                    <i class='bx bx-phone' style="color:var(--primary); font-size:0.8rem;"></i> ${clinic.phone}
                </p>
                <a href="${buildBookingUrl(clinic)}" class="btn-primary" style="padding:0.4rem 1rem; font-size:0.8rem; display:inline-flex; text-decoration:none; gap:0.3rem;">
                    <i class='bx bx-calendar-check'></i> Book Appointment
                </a>
            `;
            wrapper.appendChild(card);
        });

        messagesContainer.appendChild(wrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ── Show "Search again" prompt ──
    function showResetPrompt() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        styleBotMsg(msgDiv);
        msgDiv.innerHTML = `
            <p style="margin-bottom:0.5rem;">Would you like to search for another condition?</p>
            <button class="btn-outline" style="padding:0.4rem 1rem; font-size:0.85rem; cursor:pointer;" onclick="resetChatBot()">
                <i class='bx bx-refresh'></i> New Search
            </button>
        `;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ── Global reset function ──
    window.resetChatBot = function() {
        botState = 'awaiting_symptom';
        lastSymptoms = '';
        lastSpecialty = '';
        appendMessage("Sure! Please describe your new symptoms and I'll find the best care for you.", 'bot');
    };

    // ── Main send handler ──
    function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        inputField.value = '';

        if (botState === 'awaiting_symptom') {
            botState = 'processing';
            lastSymptoms = text;

            // Show loading
            const loadingId = 'loading-' + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.id = loadingId;
            loadingDiv.className = 'message bot type-indicator';
            loadingDiv.innerHTML = '<p><i class="bx bx-loader-alt bx-spin"></i> Analyzing your symptoms...</p>';
            loadingDiv.style.padding = '1rem';
            loadingDiv.style.borderRadius = 'var(--radius-lg)';
            loadingDiv.style.background = 'var(--bg-surface)';
            loadingDiv.style.color = 'var(--text-muted)';
            loadingDiv.style.alignSelf = 'flex-start';
            messagesContainer.appendChild(loadingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(() => {
                document.getElementById(loadingId).remove();

                const match = matchSpecialty(text);
                lastSpecialty = match.specialty;

                appendMessage(`Based on your symptoms ("${text}"), I recommend consulting a ${match.specialty}.`, 'bot');

                setTimeout(() => {
                    appendMessage("Let me find the nearest top-rated clinics for you. Share your location or type it manually:", 'bot');

                    // Location button
                    const btnId = 'loc-btn-' + Date.now();
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'message bot';
                    styleBotMsg(msgDiv);
                    msgDiv.innerHTML = `
                        <div id="${btnId}" style="margin-top:0.25rem;">
                            <button class="btn-primary" style="padding:0.5rem 1rem; font-size:0.9rem;" onclick="requestBotLocation('${btnId}')">
                                <i class='bx bx-current-location'></i> Share My Location
                            </button>
                        </div>
                    `;
                    messagesContainer.appendChild(msgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    botState = 'awaiting_location';
                }, 600);
            }, 1500);

        } else if (botState === 'awaiting_location') {
            processLocation(text);
        } else if (botState === 'done') {
            // Allow restarting
            window.resetChatBot();
            // Re-process the new input as a symptom
            lastSymptoms = text;
            botState = 'processing';
            const loadingId = 'loading-' + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.id = loadingId;
            loadingDiv.className = 'message bot type-indicator';
            loadingDiv.innerHTML = '<p><i class="bx bx-loader-alt bx-spin"></i> Analyzing your symptoms...</p>';
            loadingDiv.style.padding = '1rem';
            loadingDiv.style.borderRadius = 'var(--radius-lg)';
            loadingDiv.style.background = 'var(--bg-surface)';
            loadingDiv.style.color = 'var(--text-muted)';
            loadingDiv.style.alignSelf = 'flex-start';
            messagesContainer.appendChild(loadingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(() => {
                document.getElementById(loadingId).remove();
                const match = matchSpecialty(text);
                lastSpecialty = match.specialty;
                appendMessage(`Based on your symptoms ("${text}"), I recommend consulting a ${match.specialty}.`, 'bot');
                setTimeout(() => {
                    appendMessage("Let me find the nearest top-rated clinics for you. Share your location or type it manually:", 'bot');
                    const btnId = 'loc-btn-' + Date.now();
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'message bot';
                    styleBotMsg(msgDiv);
                    msgDiv.innerHTML = `
                        <div id="${btnId}" style="margin-top:0.25rem;">
                            <button class="btn-primary" style="padding:0.5rem 1rem; font-size:0.9rem;" onclick="requestBotLocation('${btnId}')">
                                <i class='bx bx-current-location'></i> Share My Location
                            </button>
                        </div>
                    `;
                    messagesContainer.appendChild(msgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    botState = 'awaiting_location';
                }, 600);
            }, 1500);
        }
    }

    // ── Geolocation handler ──
    window.requestBotLocation = function(btnContainerId) {
        const container = document.getElementById(btnContainerId);
        if (container) {
            container.innerHTML = '<p><i class="bx bx-loader-alt bx-spin"></i> Fetching location...</p>';
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    processLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
                },
                () => {
                    if (container) container.innerHTML = '<p style="color:#ef4444;">Location access denied. Please type your area name instead.</p>';
                }
            );
        } else {
            if (container) container.innerHTML = '<p style="color:#ef4444;">Geolocation not supported. Please type your area name.</p>';
        }
    };

    // ── Process location & show results ──
    function processLocation(locationText) {
        botState = 'finding_clinics';
        appendMessage(`Searching for the best clinics near: ${locationText}...`, 'bot');

        setTimeout(() => {
            const match = matchSpecialty(lastSymptoms);
            const results = findHospitals(match.types, 3);

            appendMessage(`Great news! I found ${results.length} top-rated places for a ${lastSpecialty}:`, 'bot');

            setTimeout(() => {
                renderClinicCards(results);

                setTimeout(() => {
                    appendMessage('Click "Book Appointment" on any card above to schedule your visit. The hospital details will be pre-filled for you!', 'bot');
                    botState = 'done';
                    showResetPrompt();
                }, 400);
            }, 300);
        }, 1800);
    }

    // ── Event listeners ──
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
