<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Teacher Student Control Panel</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('http://localhost:8080/rohangpt/images/loging_background.jpg') no-repeat center center fixed;
            background-size: cover;
            color: white;
        }
        .container {
    margin-top: 150px; /* Increase margin-top to push the box down */
    background-color: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 20px; /* Rounded corners for floating effect */
    max-width: 400px; /* Shrink the box size */
    box-shadow: 9px 9px 18px rgba(0, 0, 0, 0.2); /* Removed white shadow */
    color: black;
    position: relative;
}


        .form-group label {
            font-weight: bold;
        }
        .btn-custom {
            background-color: #ff4081;
            color: white;
            border: none;
        }
        .btn-custom:hover {
            background-color: #e6006e;
        }
        h2 {
            font-size: 3.5rem; /* Bigger size for more impact */
            font-weight: bold;
            color: #ff004f; /* Deep color for the title */
            text-align: center;
            text-shadow:
                8px 8px 16px rgba(0, 0, 0, 0.3),  /* Darker shadow for depth */
                -8px -8px 16px rgba(255, 255, 255, 0.8);  /* Lighter shadow for the raised effect */
        }
        .register-link {
            margin-top: 15px;
            text-align: center;
            font-size: 1rem;
            color: #ff4081;
        }
        .register-link a {
            color: #ff4081;
            font-weight: bold;
            text-decoration: none;
        }
        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="container">
    <h2 class="text-center">Login</h2>
    <form action="/school_management/login_process.php" method="POST">
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Enter your password" required>
        </div>

        <button type="submit" class="btn btn-custom btn-block">Login</button>
    </form>

    <!-- Register Link -->
    <div class="register-link">
        <p>Don't have an account? <a href="/school_management/register.php">Register</a></p>
    </div>
</div>

<script>
    // Prevent form from showing previous values when refreshed
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
</script>

</body>
</html>
