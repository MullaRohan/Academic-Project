<?php
// Step 1: Include the database connection
require_once 'db_connection.php'; // Make sure this file contains the connection to your XAMPP database

// Step 2: Start the session and check if the user is an admin
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: login.php");
    exit();
}

// Step 3: Fetch the student's information by ID
if (isset($_GET['id'])) {
    $student_id = $_GET['id'];
    
    $sql = "SELECT * FROM students WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
    } else {
        echo "Student not found!";
        exit();
    }
}

// Step 4: Update student details if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $father_name = $_POST['father_name'];
    $mother_name = $_POST['mother_name'];
    $present_address = $_POST['present_address'];
    $permanent_address = $_POST['permanent_address'];
    $department = $_POST['department'];
    $session = $_POST['session'];
    $phone_number = $_POST['phone_number'];

    $update_sql = "UPDATE students SET name=?, father_name=?, mother_name=?, present_address=?, permanent_address=?, department=?, session=?, phone_number=? WHERE id=?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("ssssssssi", $name, $father_name, $mother_name, $present_address, $permanent_address, $department, $session, $phone_number, $student_id);

    if ($update_stmt->execute()) {
        // After successful update, redirect to the student list page
        header("Location: http://localhost:8080/school_management/students_list.php");
        exit();
    } else {
        echo "Error updating record: " . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student Information</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-image: url('http://localhost:8080/school_management/images/student_dashboard_background.jpg.jpg');
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
        }
        h2 {
            font-family: 'Times New Roman', serif;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            color: #333;
        }
        form {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            color: #555;
        }
        label {
            font-weight: bold;
            color: #333;
        }
        .form-control {
            border-radius: 5px;
            padding: 10px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
        }
        .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            text-align: left;
        }
        table th, table td {
            padding: 12px;
            border: 1px solid #ddd;
        }
        table th {
            background-color: #f8f9fa;
            color: #333;
            font-weight: bold;
        }
        table tr:nth-child(odd) {
            background-color: #f9f9f9;
        }
        table tr:nth-child(even) {
            background-color: #ececec;
        }
    </style>
</head>
<body>
<div class="container mt-5">
    <h2>Edit Student Information</h2>
    <form action="edit_student_admin.php?id=<?php echo $student['id']; ?>" method="POST">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?php echo $student['name']; ?>" required>
        </div>
        <div class="form-group">
            <label for="father_name">Father's Name</label>
            <input type="text" class="form-control" id="father_name" name="father_name" value="<?php echo $student['father_name']; ?>" required>
        </div>
        <div class="form-group">
            <label for="mother_name">Mother's Name</label>
            <input type="text" class="form-control" id="mother_name" name="mother_name" value="<?php echo $student['mother_name']; ?>" required>
        </div>
        <div class="form-group">
            <label for="present_address">Present Address</label>
            <input type="text" class="form-control" id="present_address" name="present_address" value="<?php echo $student['present_address']; ?>" required>
        </div>
        <div class="form-group">
            <label for="permanent_address">Permanent Address</label>
            <input type="text" class="form-control" id="permanent_address" name="permanent_address" value="<?php echo $student['permanent_address']; ?>" required>
        </div>
        <div class="form-group">
            <label for="department">Department</label>
            <input type="text" class="form-control" id="department" name="department" value="<?php echo $student['department']; ?>" required>
        </div>
        <div class="form-group">
            <label for="session">Session</label>
            <input type="text" class="form-control" id="session" name="session" value="<?php echo $student['session']; ?>" required>
        </div>
        <div class="form-group">
            <label for="phone_number">Phone Number</label>
            <input type="text" class="form-control" id="phone_number" name="phone_number" value="<?php echo $student['phone_number']; ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update Student Info</button>
    </form>
</div>
</body>
</html>
