<?php
// Include the config.php to establish database connection

// Now you can use the $conn PDO instance for any database interactions
// Example of a simple query:
try {
    $stmt = $conn->query("SELECT * FROM stations");
    $stations = $stmt->fetchAll();

    // Loop through stations and output their names
    foreach ($stations as $station) {
        echo $station['name'] . "<br>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>