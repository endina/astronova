/**
 * SpeakSafe - Interactive Safety Map Engine
 * Powered by Leaflet.js & CartoDB Dark Matter Tiles
 */

// --- LEAFLET DEFAULT PIN GRAPHICS FIX ---
// This explicitly points Leaflet to the official CDN images so pins never look broken locally
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ----------------------------------------

// 1. INITIALIZE MAP CANVAS
// Centered broadly on Pristina, Kosovo (Lat: 42.6629, Lng: 21.1655) with an appropriate zoom level
const map = L.map('live-incident-map').setView([42.6629, 21.1655], 13);

// 2. INJECT DARK-THEME MAP TILES
// This pulls the open-source CartoDB 'Dark Matter' layout so it seamlessly blends with your dark background
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// 3. SEED HISTORICAL DEMO DATA
// Custom coordinate sets representing sample reports to demonstrate how the app functions
const mockIncidents = [
    { 
        coords: [42.6660, 21.1620], 
        text: "<div style='color: #0f172a; font-family: sans-serif;'><b style='color: #0096b4; font-size: 14px;'>City Center Platform Check</b><br>⚠️ Recurrent cyberbullying reported on Discord channels.<br><span style='color: #eab308;'>⭐ Safety Rating: 2/5 Stars</span></div>" 
    },
    { 
        coords: [42.6515, 21.1490], 
        text: "<div style='color: #0f172a; font-family: sans-serif;'><b style='color: #0096b4; font-size: 14px;'>Veternik Regional Hub</b><br>⚠️ Anonymous harassment trends flagged via localized WhatsApp groups.<br><span style='color: #eab308;'>⭐ Safety Rating: 1/5 Stars</span></div>" 
    }
];

// Loop through the historical metrics and drop them onto our map layer
mockIncidents.forEach(item => {
    L.marker(item.coords)
     .addTo(map)
     .bindPopup(item.text);
});

// 4. INTERACTIVE EVENT LISTENER: DROP A PIN ON CLICK
// Listens for a mouse-click anywhere on the map container, then triggers prompts to log user feedback
map.on('click', function(e) {
    const clickLocation = e.latlng;
    
    // Step A: Gather platform or area name
    const platformName = prompt("Enter the school area or app platform name (e.g., Central High School / Instagram):");
    if (!platformName) return; // Exit if the user hits cancel

    // Step B: Gather custom threat scenario details
    const incidentDetails = prompt("Briefly explain your digital climate experience (100% anonymous):");
    if (!incidentDetails) return;

    // Step C: Gather star assessment metric
    const stars = prompt("Rate the digital safety environment here from 1 (Extremely Toxic) to 5 (Safe & Guarded):", "1");
    if (!stars) return;
    
    // Step D: Programmatically drop the custom user pin on the map
    const dynamicMarker = L.marker([clickLocation.lat, clickLocation.lng]).addTo(map);
    
    // Step E: Bind a cleanly formatted HTML popup containing their raw input to the new pin
    const popupContent = `
        <div style="color: #0f172a; font-family: sans-serif; min-width: 160px;">
            <b style="color: #0096b4; font-size: 14px;">${platformName}</b><br>
            <p style="margin: 4px 0;">📌 <i>Incident:</i> ${incidentDetails}</p>
            <span style="color: #eab308; font-weight: bold;">⭐ Safety: ${stars}/5 Stars</span>
        </div>
    `;
    
    dynamicMarker.bindPopup(popupContent).openPopup();
});