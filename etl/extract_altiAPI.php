<?php

function extractElevationData($latitude, $longitude) {
    // Construct the URL with dynamic coordinates
    $url = "https://www.elevation-api.eu/v1/elevation/$latitude/$longitude";

    // Initialize a cURL session
    $ch = curl_init($url);

    // Set options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute the cURL session and get the content
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        // Handle error (log it, return an error message, etc.)
        error_log('cURL error: ' . curl_error($ch));
        curl_close($ch);
        return null; // Return null on error
    }

    // Close the cURL session
    curl_close($ch);

    var_dump($response);

    // Decode the JSON response and return it
    return json_decode($response, true);
}

?>
