<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | Teacher Student Control Panel</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('http://localhost:8080/rohangpt/images/register_bakground.jpg') no-repeat center center fixed;
            background-size: cover;
            color: white;
        }
        .container {
            margin-top: 50px;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 20px; /* Rounded corners for floating effect */
            max-width: 600px;
            box-shadow: 9px 9px 18px rgba(0, 0, 0, 0.2), -2px -2px 18px rgba(255, 255, 255, 0.9); /* Neumorphism effect */
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
        .login-link {
            margin-top: 15px;
            text-align: center;
            font-size: 1rem;
            color: #ff4081;
        }
        .login-link a {
            color: #ff4081;
            font-weight: bold;
            text-decoration: none;
        }
        .login-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="container">
    <h2 class="text-center">Register</h2>
    <form action="/school_management/register_process.php" method="POST">
        <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="Enter your full name" required>
        </div>

        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Enter a password" required>
        </div>

        <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm your password" required>
        </div>

        <div class="form-group">
            <label for="role">Role</label>
            <select class="form-control" id="role" name="role" required>
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        <button type="submit" class="btn btn-custom btn-block">Register</button>
    </form>

    <!-- Login Link -->
    <div class="login-link">
        <p>Already have an account? <a href="/school_management/login.php">Login</a> here</p>
    </div>
</div>

<script>
    // Password validation to check if both password fields match
    const password = document.getElementById('password');
    const confirm_password = document.getElementById('confirm_password');

    confirm_password.addEventListener('input', function() {
        if (password.value !== confirm_password.value) {
            confirm_password.setCustomValidity("Passwords do not match.");
        } else {
            confirm_password.setCustomValidity('');
        }
    });

    // Prevent form from showing previous values when refreshed
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
</script>

</body>
</html>
