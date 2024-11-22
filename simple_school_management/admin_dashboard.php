<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('http://localhost:8080/school_management/images/admin_dashboard_background.jpg');
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .dashboard-box {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 50px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .dashboard-box h1 {
            font-family: 'Times New Roman', serif;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }
        .dashboard-box p {
            font-family: 'Times New Roman', sans-serif;
            font-size: 17px;
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }
        .btn-custom {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px;
            transition: background-color 0.3s ease;
        }
        .btn-custom:hover {
            background-color: #ed3a51;
        }
        .logout-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            cursor: pointer;
        }
        .logout-btn:hover {
            background-color: #ed3a51;
        }
    </style>
</head>
<body>
<div class="dashboard-box">
    <h1>Welcome to Admin Dashboard, Sir!</h1>
    <p>
        Here you can view the list of students and teachers.<br/>
        You will also be able to see the detailed information of each student and teacher.<br/>
        Additionally, you have the option to delete their records if needed.
    </p>
    <a href="students_list.php" class="btn btn-custom">Student List</a>
    <a href="teachers_list.php" class="btn btn-custom">Teacher List</a>
    <a href="logout.php" class="logout-btn">Logout</a> <!-- Logout button -->
</div>
</body>
</html>
