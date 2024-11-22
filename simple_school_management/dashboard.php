<?php
session_start();
include 'db_connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get the user's role from the session
$role = $_SESSION['role']; // Using the 'role' column from the 'users' table

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5">
    <h2>Welcome to your <?php echo htmlspecialchars($role); ?> dashboard!</h2>
    <p>This is a personalized dashboard with role-specific functionalities.</p>
    <!-- Add buttons, features, and navigation based on roles -->
    
    <?php
    // Display different content based on the role
    if ($role == 'admin') {
        echo "<p>Admin-specific content goes here.</p>";
    } elseif ($role == 'teacher') {
        echo "<p>Teacher-specific content goes here.</p>";
    } elseif ($role == 'student') {
        echo "<p>Student-specific content goes here.</p>";
    } else {
        echo "<p>Unknown role.</p>";
    }
    ?>
</div>
</body>
</html>
