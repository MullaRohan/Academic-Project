
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('http://localhost:8080/rohangpt/images/register_bakground.jpg') no-repeat center center fixed;
            background-size: cover;
            color: black; /* Adjusted font color for readability */
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 20px;
            max-width: 600px;
            box-shadow: 9px 9px 18px rgba(0, 0, 0, 0.2), -2px -2px 18px rgba(255, 255, 255, 0.9);
            text-align: center;  /* Align text to the center */
            margin-top: 50px; /* Additional margin to move down */
        }
        h2 {
            color: #333333;  /* More visible color for the heading */
        }
        p {
            color: #555555;  /* Slightly darker color for paragraph */
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Registration Successful!</h2>
        <p>You have successfully registered as <strong><?php echo htmlspecialchars($_GET['role']); ?></strong>.</p>
        <p>Please <a href="/school_management/login.php">Login</a> to continue.</p>
    </div>
</body>
</html>
