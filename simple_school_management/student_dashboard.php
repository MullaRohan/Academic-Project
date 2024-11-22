<?php
session_start();
include 'db_connection.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get the logged-in user's ID from the session
$user_id = $_SESSION['user_id'];

// Fetch student details from the students table based on user_id
$query = "SELECT name, father_name, mother_name, present_address, permanent_address, phone_number, department, session, id FROM students WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);  // Bind the user_id to the query
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Fetch the student data
    $student = $result->fetch_assoc();
    $name = $student['name'] ?? 'NONE';  // Fetch the name directly from the students table
    $father_name = $student['father_name'] ?? 'NONE';
    $mother_name = $student['mother_name'] ?? 'NONE';
    $present_address = $student['present_address'] ?? 'NONE';
    $permanent_address = $student['permanent_address'] ?? 'NONE';
    $phone_number = $student['phone_number'] ?? 'NONE';
    $department = $student['department'] ?? 'NONE';
    $session = $student['session'] ?? 'NONE';
    $id = $student['id'];  // The student's unique ID from the students table
} else {
    // If no student data is found, set default placeholder values
    $name = 'NONE';
    $father_name = "NONE";
    $mother_name = "NONE";
    $present_address = "NONE";
    $permanent_address = "NONE";
    $phone_number = "NONE";
    $department = "NONE";
    $session = "NONE";
    $id = "NONE";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('http://localhost:8080/school_management/images/student_dashboard_background.jpg.jpg') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .dashboard-box {
            background: linear-gradient(135deg, #f9f9f9, #e0f7fa);
            padding: 20px;
            border-radius: 15px;
            width: 600px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            text-align: center;
            min-height: 400px;
        }
        h2 {
            font-size: 2.5rem;
            color: #333;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
            white-space: nowrap;
        }
        .info {
            text-align: left;
            margin-bottom: 20px;
            font-size: 1.2rem;
        }
        .info p {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
        }
        .btn {
            margin: 10px;
            width: 150px;
        }
        .btn-custom {
            background-color: white;
            color: black;
            border: 2px solid #ff4081;
            border-radius: 10px;
            transition: 0.3s ease;
        }
        .btn-custom:hover {
            background-color: #ff4081;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>

<div class="dashboard-box">
    <h2>Welcome to Student Dashboard<br/> <?php echo htmlspecialchars($name); ?>!</h2>
    <div class="info">
        <p><strong>Name:</strong> <span><?php echo htmlspecialchars($name); ?></span></p>
        <p><strong>Father's Name:</strong> <span><?php echo htmlspecialchars($father_name); ?></span></p>
        <p><strong>Mother's Name:</strong> <span><?php echo htmlspecialchars($mother_name); ?></span></p>
        <p><strong>Present Address:</strong> <span><?php echo htmlspecialchars($present_address); ?></span></p>
        <p><strong>Permanent Address:</strong> <span><?php echo htmlspecialchars($permanent_address); ?></span></p>
        <p><strong>Phone Number:</strong> <span><?php echo htmlspecialchars($phone_number); ?></span></p>
        <p><strong>Department:</strong> <span><?php echo htmlspecialchars($department); ?></span></p>
        <p><strong>Session:</strong> <span><?php echo htmlspecialchars($session); ?></span></p>
        <p><strong>ID:</strong> <span><?php echo htmlspecialchars($id); ?></span></p>
    </div>
    
    <a href="editstudentinfo.php" class="btn btn-custom">Edit Info</a>
    <a href="logout.php" class="btn btn-custom">Logout</a>
</div>

</body>
</html>
