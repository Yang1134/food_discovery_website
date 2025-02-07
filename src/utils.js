
export function checkCoordsBounded(coordsList, bounds) {
    let arr = []
    for (let i = 0; i < coordsList.length; i++) {
        const lat = coordsList[i].coordinates.lat;
        const lng = coordsList[i].coordinates.lng;

        if (lat >= bounds.swLat && lat <= bounds.neLat && lng >= bounds.swLng && lng <= bounds.neLng) {
            arr.push(coordsList[i]);
        }
    }

    return arr
}

// Helper function to calculate bounds based on user location
export function calculateBounds(lat, lng, radius = 0.1) {
    // Default radius is 0.1 degrees (approximately 10 kilometers)

    // Calculate the North-East and South-West corners of the bounds
    const neLat = lat + radius;
    const neLng = lng + radius;
    const swLat = lat - radius;
    const swLng = lng - radius;

    return { neLat, neLng, swLat, swLng };
}
