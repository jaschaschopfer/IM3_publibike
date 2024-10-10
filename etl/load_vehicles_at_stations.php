<?php

// Include the configuration file to establish a database connection
require_once('config.php');

// Include the transform script to get the transformVehiclesData function
require_once('transform_vehicles_at_stations.php');

// Call the transformVehiclesData() function to get the transformed data
$transformedData = transformVehiclesData();  // This will now run when you call this PHP file

// Loop through the transformed data and insert into the database
foreach ($transformedData as $vehicleData) {
    try {
        // Prepare the SQL query to insert vehicle counts along with the timestamp
        $sql = "INSERT INTO vehicles_at_station (ebikes_count, velos_count, station_id, timestamp) 
                VALUES (:ebikes_count, :velos_count, :station_id, :timestamp)";

        // Prepare the statement using PDO
        $stmt = $pdo->prepare($sql);

        // Execute the prepared statement with vehicle data
        $stmt->execute([
            ':ebikes_count' => $vehicleData['ebikes_count'],
            ':velos_count' => $vehicleData['velos_count'],
            ':station_id' => $vehicleData['station_id'],
            ':timestamp' => $vehicleData['timestamp'], // Use the same timestamp for all rows
        ]);

        // Optional: Echo success message for each entry
        echo "Inserted vehicle data for station ID: " . $vehicleData['station_id'] . "<br>";

    } catch (PDOException $e) {
        // Catch any SQL errors and output them
        echo "Error inserting data for station ID: " . $vehicleData['station_id'] . " - " . $e->getMessage() . "<br>";
    }
}

echo "Vehicle data successfully written to the database.";

?>