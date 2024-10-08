<?php

// Include the configuration file to establish a database connection
require_once('config.php');
$transformedData=require_once('transform_stations.php');

var_dump(array_slice($transformedData, 0, 5)); // Debugging: view the first 5 entries

// Loop through each transformed station and write it to the database
foreach ($transformedData as $stationData) {
    if ($stationData['elevation'] >= 492.0000 && $stationData['elevation'] <= 581.5627) {
        try {
            // Prepare the SQL query
            $sql = "INSERT INTO stations (api_id, name, latitude, longitude, altitude) 
                    VALUES (:api_id, :name, :latitude, :longitude, :altitude)
                    ON DUPLICATE KEY UPDATE 
                    name = VALUES(name), 
                    latitude = VALUES(latitude), 
                    longitude = VALUES(longitude), 
                    altitude = VALUES(altitude)";

            // Prepare the statement using PDO
            $stmt = $pdo->prepare($sql);

            // Execute the prepared statement with data from each transformed station
            $stmt->execute([
                ':api_id' => $stationData['api_id'],
                ':name' => $stationData['name'],
                ':latitude' => $stationData['latitude'],
                ':longitude' => $stationData['longitude'],
                ':altitude' => $stationData['elevation']
            ]);

            // Optional: Echo success message for each entry
            echo "Inserted station: " . $stationData['name'] . " (API ID: " . $stationData['api_id'] . ")<br>";

        } catch (PDOException $e) {
            // Catch any SQL errors and output them
            echo "Error inserting station: " . $stationData['name'] . " - " . $e->getMessage() . "<br>";
        }
    }
}

echo "Total stations to insert: " . count($transformedData) . "<br>";

echo "Stations data has been successfully written to the database.";

?>