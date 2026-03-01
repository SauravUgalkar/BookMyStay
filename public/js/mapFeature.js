// mapFeature.js
// Leaflet + OpenStreetMap map initialization for listing details page
// Requires listing geometry and info to be passed via window.listingMapData

window.addEventListener('DOMContentLoaded', function() {
  // Defensive: fallback to Delhi if geometry is missing
  const geometry = window.listingMapData && window.listingMapData.geometry ? window.listingMapData.geometry : { coordinates: [77.2090, 28.6139] };
  const coords = geometry && Array.isArray(geometry.coordinates) ? geometry.coordinates : [77.2090, 28.6139];

  // Leaflet expects [lat, lng] for map center, so we reverse the GeoJSON order
  const map = L.map('map').setView([coords[1], coords[0]], 12);
  // Add OpenStreetMap tile layer (free, no API key)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  // Add marker at listing location
  const marker = L.marker([coords[1], coords[0]]).addTo(map);
  // Add popup with listing title and location
  const popupContent = `<b>${window.listingMapData.title}</b><br><i class='fa-solid fa-location-dot'></i> ${window.listingMapData.location}, ${window.listingMapData.country}`;
  marker.bindPopup(popupContent).openPopup();
});
