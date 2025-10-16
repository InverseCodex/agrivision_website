document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('disease_upload_btn');
    const fileInput = document.getElementById('disease_json_upload');
    const mapContainer = document.getElementById('disease_map_container');
    const mapDiv = document.getElementById('disease_map');
    let map;

    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) throw new Error('Invalid format');
                mapContainer.style.display = 'block';
                setTimeout(function() {
                    if (map) {
                        map.remove();
                        map = null;
                    }
                    map = L.map('disease_map').setView([0, 0], 2);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '© OpenStreetMap'
                    }).addTo(map);
                    let bounds = [];
                    data.forEach(point => {
                        if (typeof point.lat === 'number' && typeof point.lng === 'number') {
                            const marker = L.marker([point.lat, point.lng]).addTo(map);
                            marker.bindTooltip(
                                `<strong>Disease:</strong> ${point.disease || 'N/A'}<br>` +
                                `<strong>Confidence:</strong> ${point.confidence || 'N/A'}<br>` +
                                `<strong>Lat:</strong> ${point.lat}<br><strong>Lng:</strong> ${point.lng}`,
                                {permanent: false, direction: 'top'}
                            );
                            bounds.push([point.lat, point.lng]);
                        }
                    });
                    if (bounds.length) map.fitBounds(bounds);
                }, 100);
            } catch (err) {
                alert('Invalid JSON file format. Expecting an array of objects with lat, lng, disease, and confidence.');
            }
        };
        reader.readAsText(file);
    });
});
