<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Student Control Panel</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('images/background-image.jpg.jpg') no-repeat center center fixed;
            background-size: cover;
            color: white;
        }
        .navbar {
            padding: 1rem 2rem;
            background-color: transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar a {
            color: white;
            margin-right: 15px;
            text-decoration: none;
        }
        .navbar a:hover {
            color: #f1f1f1;
        }
        .social-icons img {
            width: 30px;
            height: 30px;
            margin-left: 15px;
        }
        .social-icons a {
            margin-left: 15px;
        }
        .main-content {
            text-align: center;
            padding-top: 150px;
        }
        .main-content h1 {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .main-content p {
            font-size: 1.2rem;
            margin-bottom: 40px;
        }
        .btn-register, .btn-login {
            padding: 10px 25px;
            margin: 0 10px;
            font-size: 1.2rem;
            border-radius: 30px;
            border: none;
            background-color: white;
            color: black;
        }
        .btn-register:hover {
            background-color: #ff4081;
            color: white;
        }
        .btn-login:hover {
            background-color: #ff4081;
            color: white;
        }
    </style>
</head>
<body>

<!-- Navbar (Home, Services, About Us) -->
<nav class="navbar">
    <div>
        <a href="home.php">Home</a>
        <a href="home.php">Services</a>
        <a href="about.php">About Us</a>
    </div>
    <div class="social-icons">
        <a href="https://www.facebook.com/rohan.mirpur8/" target="_blank">
            <img src="http://localhost:8080/school_management/images/Facebook_Logo.png" alt="Facebook">
        </a>
        <a href="https://www.linkedin.com/in/rohanmulla/" target="_blank">
            <img src="http://localhost:8080/school_management/images/linkedin_logo.webp" alt="LinkedIn">
        </a>
        <a href="https://github.com/rohanmulla" target="_blank">
            <img src="http://localhost:8080/school_management/images/github_logo.webp" alt="GitHub">
        </a>
    </div>
</nav>

<!-- Main Section -->
<div class="main-content">
    <h1>Welcome to Teacher Student Control Panel</h1>
    <p>It's a server where all students and teachers can create accounts and update their profiles and information.</p>
    <a href="register.php" class="btn btn-register">Register Now</a>
    <a href="login.php" class="btn btn-login">Login Now</a>
</div>

<!-- Bootstrap JS and FontAwesome for icons -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js"></script>
</body>
</html>
