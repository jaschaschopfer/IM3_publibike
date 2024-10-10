<?php
// Include database connection from config.php
require_once 'config.php'; // Ensure config.php is set up properly

// Set headers for JSON output
header('Content-Type: application/json');

// Get the input timestamp from the URL query string (GET) without seconds
if (isset($_GET['timestamp'])) {
    $inputTimestamp = $_GET['timestamp']; // Expected format: 'YYYY-MM-DD HH:MM'

    try {
        // SQL query to get the nearest vehicle data for each station at the provided timestamp (ignoring seconds)
        $sql = "
            SELECT s.name, s.altitude, vas.timestamp, vas.ebikes_count, vas.velos_count
            FROM vehicles_at_station vas
            INNER JOIN stations s ON vas.station_id = s.ID
            WHERE vas.timestamp = (
                SELECT vas_inner.timestamp
                FROM vehicles_at_station vas_inner
                WHERE vas_inner.station_id = vas.station_id
                ORDER BY ABS(TIMESTAMPDIFF(SECOND, vas_inner.timestamp, :timestamp)) ASC
                LIMIT 1
            )
            ORDER BY s.altitude ASC;  -- Order the result by altitude (low to high)
        ";


        // Prepare the statement
        $stmt = $pdo->prepare($sql);

        // Bind the timestamp parameter, ignoring seconds
        $stmt->bindValue(':timestamp', $inputTimestamp);

        // Execute the query
        $stmt->execute();

        // Fetch all results
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if data was found
        if ($result) {
            // Output the nearest records for each station in JSON format
            echo json_encode($result, JSON_PRETTY_PRINT);
        } else {
            // No data found for the provided timestamp
            echo json_encode(['message' => 'No data found for the provided timestamp']);
        }
    } catch (PDOException $e) {
        // Handle SQL errors
        echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    }
} else {
    // No timestamp provided
    echo json_encode(['error' => 'No timestamp provided']);
}
?>
