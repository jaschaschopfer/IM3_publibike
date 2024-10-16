<?php
// Connect to your database with error handling
require_once('config.php');

// Set the fixed date and time (e.g., '2024-10-10 12:00:00')
$datetime = '2024-10-10 12:00:00';

// Fetch stations data and bike counts for the specific hour and minute, ignoring seconds
$query = "
SELECT s.name, s.altitude, 
  (SELECT SUM(ebikes_count) FROM vehicles_at_stations WHERE station_id = s.ID AND timestamp LIKE :datetime_pattern) AS ebikes_count, 
  (SELECT SUM(velos_count) FROM vehicles_at_stations WHERE station_id = s.ID AND timestamp LIKE :datetime_pattern) AS velos_count
FROM stations s
ORDER BY s.altitude ASC;
";

$statement = $pdo->prepare($query);
$datetime_pattern = substr($datetime, 0, 16) . '%';  // Truncate to 'YYYY-MM-DD HH:MM' to ignore seconds
$statement->bindParam(':datetime_pattern', $datetime_pattern, PDO::PARAM_STR);
$statement->execute();
$stations = $statement->fetchAll(PDO::FETCH_ASSOC);

// Output the data as JSON
header('Content-Type: application/json');
echo json_encode($stations);
?>
