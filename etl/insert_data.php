<?php
require_once 'config.php'; // Include your database configuration

// Include the transform file to get transformed data
$transformedData = include('transform.php');

// Prepare an SQL statement for inserting data
$sql = "INSERT INTO stations (api_id, name, latitude, longitude, elevation) VALUES (?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);

try {
    // Begin a transaction
    $pdo->beginTransaction();
    
    foreach ($transformedData as $station) {
        // Bind parameters and execute the statement
        $stmt->execute([
            $station['api_id'],
            $station['name'],
            $station['latitude'],
            $station['longitude'],
            $station['elevation'],
        ]);
    }
    
    // Commit the transaction
    $pdo->commit();
    echo "Data successfully inserted into the database.";
} catch (Exception $e) {
    // Rollback the transaction if something failed
    $pdo->rollBack();
    echo "Failed to insert data: " . $e->getMessage();
}
?>
