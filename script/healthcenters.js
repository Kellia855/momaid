// Function to handle the clinic search button click
async function searchClinics() {
    const locationInput = document.getElementById('locationInput');
    if (!locationInput || !locationInput.value.trim()) {
        alert('Please enter a location to search for clinics');
        return;
    }

    // Show loading state
    const container = document.getElementById('clinics-container');
    container.innerHTML = '<div class="loading">Searching for clinics...</div>';

    try {
        const clinics = await findClinics(locationInput.value);
        displayClinics(clinics);
    } catch (error) {
        container.innerHTML = `<div class="error">Error finding clinics: ${error.message}</div>`;
    }
}

window.findClinics = async function getHealthCenters(location) {
    const apiKey = 'de6048661b57418385ed8b8074be3afb'; 
    const encodedLocation = encodeURIComponent(location);

    try {
        // Step 1: Get coordinates of the entered location
        const geocodeRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedLocation}&apiKey=${apiKey}`);
        const geocodeData = await geocodeRes.json();

        if (!geocodeData.features || geocodeData.features.length === 0) {
            throw new Error('Location not found');
        }

        const { lat, lon } = geocodeData.features[0].properties;

        // Step 2: Search nearby places using Geoapify Places API
        const radius = 5000; // 5 km radius
        // Try to get placeIdInput element
        const placeIdInputElem = document.getElementById('placeIdInput');
        let filter;
        if (placeIdInputElem && placeIdInputElem.value) {
            filter = `place:${placeIdInputElem.value}`;
        } else {
            // Fallback: use coordinates and radius
            filter = `circle:${lon},${lat},${radius}`;
        }

        const placesRes = await fetch(`https://api.geoapify.com/v2/places?categories=healthcare.hospital,healthcare.clinic_or_praxis&filter=${filter}&limit=35&apiKey=${apiKey}`);
        const placesData = await placesRes.json();

        if (!placesData.features || placesData.features.length === 0) {
            return [];
        }

        // Step 3: Format the data to match your clinic card UI
        return placesData.features.map((place, index) => {
            const props = place.properties;
            return {
                id: props.place_id || index,
                name: props.name || 'Unnamed Clinic',
                address: props.formatted || `${props.address_line1}, ${props.city || ''}`,
                phone: props.tel || 'N/A',
                distance: props.distance ? `${(props.distance / 1000).toFixed(1)} km` : 'Nearby',
                services: ["Checkups", "Maternity", "Vaccinations"],
                hours: props.opening_hours?.text || 'See website or call for hours',
                website: props.website || ''
            };
        });
    } catch (error) {
        console.error('Geoapify API error:', error);
        throw error;
    }
}

function displayClinic(clinic) {
    const clinicCard = document.createElement('div');
    clinicCard.className = 'clinic-item';
    
    const html = `
        <div class="clinic-header">
            <h3 class="clinic-name">${clinic.name}</h3>
            <div class="distance">${clinic.distance}</div>
        </div>
        <div class="clinic-details">
            <div class="clinic-address">${clinic.address}</div>
            <div class="clinic-phone">${clinic.phone}</div>
            <div class="clinic-hours">${clinic.hours}</div>
        </div>
        <div class="clinic-services">
            <h4>Available Services</h4>
            <ul>
                ${clinic.services.map(service => `<li>${service}</li>`).join('')}
            </ul>
        </div>
        <div class="clinic-actions">
            ${clinic.website ? 
                `<a href="${clinic.website}" target="_blank" class="btn clinic-btn">Visit Website</a>` : 
                ''}
            <button class="btn clinic-btn">Get Directions</button>
            <button class="btn clinic-btn btn-secondary">Save</button>
        </div>
    `;
    
    clinicCard.innerHTML = html;
    return clinicCard;
}

// Function to display all clinics
function displayClinics(clinics) {
    const clinicsContainer = document.getElementById('clinics-container');
    if (!clinicsContainer) {
        console.error('Clinics container not found');
        return;
    }
    
    // Clear existing clinics
    clinicsContainer.innerHTML = '';
    
    if (clinics.length === 0) {
        clinicsContainer.innerHTML = '<p class="no-clinics">No clinics found in this area.</p>';
        return;
    }
    
    // Add each clinic card to the container
    clinics.forEach(clinic => {
        const clinicElement = displayClinic(clinic);
        clinicsContainer.appendChild(clinicElement);
    });
}

