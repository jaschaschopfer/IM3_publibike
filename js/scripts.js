
fetch('https://publis.danocreations.ch/etl/unload.php?timestamp=2024-10-10%2017:00') // Adjust timestamp as needed
.then(response => response.json())
.then(jsonData => {
    // Extract data for chart
    const stationNames = jsonData.map(item => item.name); // X-axis (stations)
    const altitudes = jsonData.map(item => item.altitude); // Y-axis (altitude)
    const radiusMultiplier = 1; // Multiplier for scaling radius

    // Velos data (green circles)
    const velosData = jsonData.map((item, index) => ({
        x: index + 1, // Distribute stations equally on the X-axis
        y: item.altitude,
        r: item.velos_count * radiusMultiplier // Radius scales with velos count
    }));

    // Ebikes data (yellow circles)
    const ebikesData = jsonData.map((item, index) => ({
        x: index + 1, // Distribute stations equally on the X-axis
        y: item.altitude,
        r: item.ebikes_count * radiusMultiplier// Radius scales with ebikes count
    }));

    // Set the maximum and minimum altitudes (with padding)
    const maxAltitude = Math.max(...altitudes) + 20;
    const minAltitude = Math.min(...altitudes) - 20;

    // Create scatter chart with Chart.js
    const ctx = document.getElementById('altitudeChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bubble', // Bubble chart for circle scaling
        data: {
            datasets: [
                {
                    label: 'Velos',
                    backgroundColor: 'rgba(0, 255, 0, 0.4)', // Green with 40% transparency
                    borderColor: 'rgba(0, 255, 0, 0.8)', // Green border
                    data: velosData
                },
                {
                    label: 'E-Bikes',
                    backgroundColor: 'rgba(255, 255, 0, 0.4)', // Yellow with 40% transparency
                    borderColor: 'rgba(255, 255, 0, 0.8)', // Yellow border
                    data: ebikesData
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Stationen'
                    },
                    ticks: {
                        callback: function(value, index) {
                            return stationNames[index]; // Display station names on the X-axis
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Höhenlage (m)'
                    },
                    min: minAltitude,
                    max: maxAltitude
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const count = context.raw.r / radiusMultiplier; // Reverse calculation for count from radius
                            return `${datasetLabel}: ${count} (${context.raw.y} m)`;
                        }
                    }
                }
            }
        }
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});