<?php
$servername = "localhost";   // If using XAMPP, 'localhost' is correct
$username = "root";          // XAMPP's default MySQL username is 'root'
$password = "";              // XAMPP's default MySQL password is blank (empty string)
$dbname = "school_management"; // This should match your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
