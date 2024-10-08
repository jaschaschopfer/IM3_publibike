<?php

// Include required helper functions
require_once('extract_publiAPI.php');  // To fetch data from Publibike API
require_once('config.php');  // Your database connection configuration

function transformVehiclesData() {
    global $pdo;

    // 1. Fetch all station API ids from the 'stations' table
    try {
        $stmt = $pdo->prepare("SELECT api_id, ID FROM stations");
        $stmt->execute();
        $stations = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Local DB stations
    } catch (PDOException $e) {
        die("Error fetching stations: " . $e->getMessage());
    }

    // 2. Fetch all station data from Publibike API
    $apiStationsData = extractPubliData();  // Fetch all station data from Publibike AP

    // 3. Initialize an array to store transformed data
    $transformedData = [];

    // 4. Get the current timestamp (to ensure all entries have the same one)
    $currentTimestamp = date('Y-m-d H:i:s');

    // 5. Loop through each station from the database and find corresponding data from the API
    foreach ($stations as $dbStation) {
        $stationApiId = $dbStation['api_id'];
        $stationId = $dbStation['ID']; // Local station ID in the database

        // Find the corresponding station in the API data by filtering using the API ID
        $filteredStationData = array_filter($apiStationsData['stations'], function ($station) use ($stationApiId) {
            return $station['id'] == $stationApiId;
        });

        // Get the first (and should be only) result after filtering
        $filteredStationData = reset($filteredStationData);

        if (!$filteredStationData) {
            // If no matching station is found, skip
            continue;
        }

        // Initialize counters for velos and ebikes
        $ebikesCount = 0;
        $velosCount = 0;

        // Count the vehicles by type (velos and ebikes)
        if (!empty($filteredStationData['vehicles'])) {
            foreach ($filteredStationData['vehicles'] as $vehicle) {
                if ($vehicle['type']['id'] == 1) {  // Velos
                    $velosCount++;
                } elseif ($vehicle['type']['id'] == 2) {  // E-Bikes
                    $ebikesCount++;
                }
            }
        }

        // Store the transformed data including the current timestamp
        $transformedData[] = [
            'station_id' => $stationId,      // Local station ID (DB primary key)
            'ebikes_count' => $ebikesCount,  // Count of e-bikes
            'velos_count' => $velosCount,    // Count of velos
            'timestamp'   => $currentTimestamp // Same timestamp for all
        ];
    }

    // Return the transformed data
    return $transformedData;
}


?>
