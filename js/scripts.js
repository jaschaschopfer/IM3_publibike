//DATE PICKER AND TIME SLIDER FUNCTIONALITY
// Initialize the Date Picker (jQuery UI)
$("#date-picker").datepicker({
    dateFormat: "yy-mm-dd", // Format the date as YYYY-MM-DD for the fetch request
    minDate: new Date(2024, 9, 10, 10, 15), // Disable dates before 2024-10-10 10:15
    maxDate: new Date(), // Disable dates after today
    defaultDate: "2024-10-10"   // Set the default date to 2024-10-10 in case somehow nothing is selected
});

// Get the current date and time
const currentDate = new Date();

// Function to round the current time to the nearest previous quarter-hour
function getNearestQuarterHour(date) {
    const minutes = date.getMinutes();
    const quarterHour = Math.floor(minutes / 15) * 15; // Round down to nearest quarter-hour
    date.setMinutes(quarterHour);
    date.setSeconds(0);
    return date;
}

// Get the nearest quarter-hour and set it as the default time
const nearestQuarterHour = getNearestQuarterHour(new Date()); // Get current time rounded to the nearest previous quarter-hour
const defaultHour = nearestQuarterHour.getHours();
const defaultMinutes = nearestQuarterHour.getMinutes();
const defaultSliderValue = (defaultHour * 60 + defaultMinutes) / 15; // Convert time to slider value (15-minute intervals)

// Set the slider range from 0 to 95 for 15-minute intervals in a 24-hour period
$("#time-slider").attr("min", 0).attr("max", 95).attr("value", 0); // Initial value at 00:00

// Function to format the date as "DD.MM.YYYY"
function formatDateForDisplay(date) {
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero to day
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero and adjust month (0-based)
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format the date as "YYYY-MM-DD"
}

// Update the date picker and time label with the current date and time
function initializeDateTime() {
    // Get the current date and the nearest previous quarter-hour
    const nearestQuarterHour = getNearestQuarterHour(new Date());

    // Set the time label to the nearest quarter-hour
    const defaultHour = nearestQuarterHour.getHours();
    const defaultMinutes = nearestQuarterHour.getMinutes();
    const defaultSliderValue = (defaultHour * 60 + defaultMinutes) / 15; // Calculate slider value based on 15-minute intervals
    updateTimeLabel(defaultSliderValue); // Set the time label
    $("#time-slider").val(defaultSliderValue); // Set the time slider value

    // Set the date picker to the current date in "DD.MM.YYYY" format
    const formattedDate = formatDateForDisplay(new Date()); // Format the current date as DD.MM.YYYY
    $("#date-picker").val(formattedDate); // Update the date picker value
}

// Function to update the time label and convert slider value to 15-minute intervals
function updateTimeLabel(value) {
    const totalMinutes = value * 15; // Each slider step represents 15 minutes
    const hours = Math.floor(totalMinutes / 60); // Convert to hours
    const minutes = totalMinutes % 60; // Get remaining minutes
    const formattedTime = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`; // Format time with leading zeroes
    $("#time-label").text(formattedTime); // Update the time label next to the slider
}

// Function to update the slider max based on today's time
function updateSliderMax() {
    const selectedDate = $("#date-picker").datepicker("getDate");
    const currentDate = new Date();

    if (selectedDate.toDateString() === currentDate.toDateString()) {
        // If today is selected, update the slider to prevent going over the current time
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const totalMinutes = currentHours * 60 + currentMinutes;
        const sliderMax = Math.floor(totalMinutes / 15); // Nearest 15-minute interval
        $("#time-slider").attr("max", sliderMax); // Update slider max
    } else if (selectedDate.toDateString() === new Date(2024, 9, 10).toDateString()) {
        // If the minimum date is selected, set the minimum time to 10:15
        const minSliderValue = Math.ceil((10 * 60 + 15) / 15); // 10:15 in 15-minute intervals
        $("#time-slider").attr("min", minSliderValue).attr("max", 95); // Update slider for min date
    } else {
        // For other days, use the full 24-hour period
        $("#time-slider").attr("min", 0).attr("max", 95);
    }
}

// Set the initial time label to the current time rounded to the nearest quarter-hour
updateTimeLabel(defaultSliderValue);
// Call this function to initialize date and time when the page loads
initializeDateTime();
updateSliderMax(); // Update the slider max based on today's time










// CHART FUNCTIONALITY
let chart; // Global variable to store the chart instance
let playInterval = null; // Interval ID for the play functionality
let isPlaying = false; // Flag to track whether the play button is active

// Function to clear the canvas before rendering a new chart
function resetCanvas() {
    $('#altitudeChart').remove(); // Remove the canvas element
    $('.graph-section').append('<canvas id="altitudeChart" width="900" height="400"></canvas>'); // Add a new canvas element
}

// Function to fetch and update the chart data based on date and time
function fetchData() {
    const date = $("#date-picker").val(); // Get the selected date from the date picker
    console.log(date);
    const timeValue = $("#time-slider").val(); // Get the slider value (0-95 for 15-minute intervals)
    const totalMinutes = timeValue * 15; // Convert slider value to total minutes
    const hours = Math.floor(totalMinutes / 60); // Convert to hours
    const minutes = totalMinutes % 60; // Get remaining minutes
    const formattedTime = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`; // Format time
    const formattedTimestamp = `${date} ${formattedTime}`; // Combine date and time for the API

    // Fetch the data from the API based on the selected date and time
    fetch('https://publis.danocreations.ch/etl/unload.php?timestamp=' + formattedTimestamp)
    .then(response => response.json())
    .then(jsonData => {
        // Extract data for chart
        const stationNames = jsonData.map(item => item.name); // X-axis (stations)
        const altitudes = jsonData.map(item => item.altitude); // Y-axis (altitude)
        const radiusMultiplier = 1; // Multiplier for scaling radius
        const radiusBase = 1;   // Base radius for circles

        // Velos data (green circles)
        const velosData = jsonData.map((item, index) => ({
            x: index + 1, // Distribute stations equally on the X-axis
            y: item.altitude,
            r: item.velos_count * radiusMultiplier + radiusBase, // Radius scales with velos count
        }));

        // E-Bikes data (yellow circles)
        const ebikesData = jsonData.map((item, index) => ({
            x: index + 1, // Distribute stations equally on the X-axis
            y: item.altitude,
            r: item.ebikes_count * radiusMultiplier + radiusBase, // Radius scales with ebikes count
        }));

        // Check if the chart already exists
        if (chart) {
            // Preserve the hidden state of Velos and Ebikes datasets
            const velosHidden = chart.getDatasetMeta(0).hidden;
            const ebikesHidden = chart.getDatasetMeta(1).hidden;

            // Update the dataset data
            chart.data.datasets[0].data = velosData; // Update Velos data
            chart.data.datasets[1].data = ebikesData; // Update Ebikes data

            // Explicitly set the visibility of Velos and Ebikes based on their previous state ((DEBUG OF RESETTING VISIBILITY WHEN CHANGING TIME))
            chart.data.datasets[0].hidden = velosHidden;
            chart.data.datasets[1].hidden = ebikesHidden;

            // Update the chart with the new data while preserving visibility
            chart.update();
        } else {
            // If the chart does not exist, create it with visibility tracking
            resetCanvas(); // Clear the canvas and create a new one
            const ctx = document.getElementById('altitudeChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'bubble', // Bubble chart for circle scaling
                data: {
                    datasets: [
                        {
                            label: 'Velos',
                            backgroundColor: 'rgba(0, 255, 0, 0.4)', // Green with 40% transparency
                            borderColor: 'rgba(0, 255, 0, 0.8)', // Green border
                            data: velosData,
                            hidden: false // Default visibility
                        },
                        {
                            label: 'E-Bikes',
                            backgroundColor: 'rgba(255, 255, 0, 0.4)', // Yellow with 40% transparency
                            borderColor: 'rgba(255, 255, 0, 0.8)', // Yellow border
                            data: ebikesData,
                            hidden: false // Default visibility
                        }
                    ]
                },
                options: {
                    responsive: true,
                    animation: false, // Disable animation when updating the graph
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
                            min: Math.min(...altitudes) - 20,
                            max: Math.max(...altitudes) + 20
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const datasetLabel = context.dataset.label;
                                    const count = (context.raw.r - radiusBase) / radiusMultiplier; // Reverse calculation for count from radius
                                    return `${datasetLabel}: ${count} (${context.raw.y} m)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Fetch data initially when the page loads
fetchData();

// Fetch new data whenever the time slider changes (real-time with `input` event)
$("#time-slider").on("input", function() {
    const sliderValue = $(this).val();
    updateTimeLabel(sliderValue); // Update the time label as the slider is dragged
    fetchData(); // Fetch the new data based on the slider value
});

// Fetch new data when the date picker changes
$("#date-picker").on("change", function() {
    updateSliderMax(); // Adjust slider limits based on selected date
    fetchData();
});

// Additional handlers for previous/next day buttons
$("#prev-day").on("click", function() {
    const date = $("#date-picker").datepicker("getDate");
    date.setDate(date.getDate() - 1); // Go to the previous day
    $("#date-picker").datepicker("setDate", date);
    updateSliderMax(); // Adjust slider limits for the new date
    fetchData(); // Update the graph after changing the date
});

$("#next-day").on("click", function() {
    const date = $("#date-picker").datepicker("getDate");
    date.setDate(date.getDate() + 1); // Go to the next day
    $("#date-picker").datepicker("setDate", date);
    updateSliderMax(); // Adjust slider limits for the new date
    fetchData(); // Update the graph after changing the date
});

// Play/Stop Button Functionality
$("#play-btn").on("click", function() {
    if (!isPlaying) {
        // Start playing (change icon to stop)
        $(this).text('■'); // Change to stop symbol
        isPlaying = true;

        // Start cycling through the slider every second (15-minute intervals)
        playInterval = setInterval(function() {
            let currentVal = parseInt($("#time-slider").val());
            let maxVal = parseInt($("#time-slider").attr("max"));
            if (currentVal < maxVal) {
                currentVal++; // Move to the next 15-minute interval
            } else {
                currentVal = 0; // Reset to 00:00 when the end of the day is reached
            }
            $("#time-slider").val(currentVal);
            updateTimeLabel(currentVal); // Update time label
            fetchData(); // Fetch new data
        }, 1000); // 1 second = 1 step (15 minutes)
    } else {
        // Stop playing (change icon to play)
        $(this).text('▶'); // Change back to play symbol
        clearInterval(playInterval); // Stop the interval
        isPlaying = false;
    }
});
