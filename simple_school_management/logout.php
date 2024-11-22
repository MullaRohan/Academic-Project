<?php
session_start();

// Destroy all session data
session_unset();
session_destroy();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
        }
        .logout-message {
            text-align: center;
            padding: 20px;
            background-color: white;
            border: 2px solid #007bff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    </style>
    <meta http-equiv="refresh" content="2;url=home.php"> <!-- Redirect after 2 seconds -->
</head>
<body>

<div class="logout-message">
    <h2>Logout Successful!</h2>
    <p>You are being redirected to the home page...</p>
</div>

</body>
</html>
