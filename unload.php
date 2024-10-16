<?php
// Include database configuration (e.g., connection details)
require_once(__DIR__ . '/etl/config.php');

// Get the timestamp from the request
if (isset($_GET['timestamp'])) {
    $timestamp = $_GET['timestamp'];

    // Prepare the SQL query to fetch data
    $query = "
        SELECT 
            stations.name, 
            stations.altitude, 
            vehicles_at_station.ebikes_count, 
            vehicles_at_station.velos_count 
        FROM 
            vehicles_at_station
        INNER JOIN 
            stations 
        ON 
            vehicles_at_station.station = stations.ID
        WHERE 
            vehicles_at_station.timestamp = :timestamp
    ";

    // Prepare and execute the statement
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':timestamp', $timestamp);
    $stmt->execute();

    // Fetch results as an associative array
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the JSON-encoded results
    echo json_encode($results);
} else {
    // If no timestamp is provided, return an error
    echo json_encode(['error' => 'No timestamp provided']);
}
?>
