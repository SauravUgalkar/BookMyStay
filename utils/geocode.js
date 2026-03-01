
// Returns coordinates as [longitude, latitude] for GeoJSON compatibility
const axios = require('axios');

async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await axios.get(url, { headers: { 'User-Agent': 'BookMyStayApp/1.0' } });
    if (response.data && response.data.length > 0) {
        return [
            parseFloat(response.data[0].lon),
            parseFloat(response.data[0].lat)
        ];
    }
    // Default to Delhi if not found
    return [77.2090, 28.6139];
}

module.exports = geocodeAddress;
