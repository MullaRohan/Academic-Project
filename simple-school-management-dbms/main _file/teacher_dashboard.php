
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

// Check if teacher record exists in the teachers table
$check_query = "SELECT * FROM teachers WHERE user_id = ?";
$stmt = $conn->prepare($check_query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Fetch the teacher data
    $teacher = $result->fetch_assoc();
    $name = $teacher['name'] ?? 'NONE';  
    $department = $teacher['department'] ?? 'NONE';
    $phone_number = $teacher['phone_number'] ?? 'NONE';
    $address = $teacher['address'] ?? 'NONE';
    $id = $teacher['id'];  // The teacher's unique ID from the teachers table
} else {
    // If no record exists, insert a new row with default values
    $insert_query = "INSERT INTO teachers (user_id, name, department, phone_number, address) VALUES (?, 'NONE', 'NONE', 'NONE', 'NONE')";
    $stmt = $conn->prepare($insert_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    // Fetch the newly created default teacher data
    $name = 'NONE';  
    $department = 'NONE';
    $phone_number = 'NONE';
    $address = 'NONE';
    $id = $conn->insert_id;  // Get the ID of the newly inserted row
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Dashboard</title>
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
    <h2>Welcome to Teacher Dashboard<br/> <?php echo htmlspecialchars($name); ?>!</h2>
    <div class="info">
        <p><strong>ID:</strong> <span><?php echo htmlspecialchars($id); ?></span></p>
        <p><strong>Name:</strong> <span><?php echo htmlspecialchars($name); ?></span></p>
        <p><strong>Department:</strong> <span><?php echo htmlspecialchars($department); ?></span></p>
        <p><strong>Phone Number:</strong> <span><?php echo htmlspecialchars($phone_number); ?></span></p>
        <p><strong>Address:</strong> <span><?php echo htmlspecialchars($address); ?></span></p>
    </div>
    
    <a href="editteacherinfo.php" class="btn btn-custom">Edit Info</a>
    <a href="logout.php" class="btn btn-custom">Logout</a>
</div>

</body>
</html>
