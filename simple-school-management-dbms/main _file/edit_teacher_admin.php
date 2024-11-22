<?php
require_once 'db_connection.php';
session_start();

// Check if the user is logged in and has admin privileges
if (!isset($_SESSION['user_id']) || $_SESSION['role'] != 'admin') {
    header("Location: login.php");
    exit();
}

// Get the teacher ID from the URL
if (isset($_GET['id'])) {
    $teacher_id = $_GET['id'];

    // Fetch the teacher's details from the database
    $sql = "SELECT * FROM teachers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $teacher = $result->fetch_assoc();
    } else {
        echo "Teacher not found.";
        exit();
    }

    $stmt->close();
} else {
    echo "No teacher ID provided.";
    exit();
}

// Handle form submission to update teacher details
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $department = $_POST['department'];
    $phone_number = $_POST['phone_number'];
    $address = $_POST['address'];

    // Update the teacher's details in the database
    $sql = "UPDATE teachers SET name = ?, department = ?, phone_number = ?, address = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $name, $department, $phone_number, $address, $teacher_id);

    if ($stmt->execute()) {
        // Redirect to the teacher list after a successful update
        header("Location: http://localhost:8080/school_management/teachers_list.php");
        exit();
    } else {
        echo "Error updating teacher details: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Teacher</title>
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
            max-width: 600px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h2>Edit Teacher Details</h2>
        <form action="" method="POST">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" name="name" class="form-control" value="<?php echo htmlspecialchars($teacher['name'], ENT_QUOTES, 'UTF-8'); ?>" required>
            </div>
            <div class="form-group">
                <label for="department">Department:</label>
                <input type="text" name="department" class="form-control" value="<?php echo htmlspecialchars($teacher['department'], ENT_QUOTES, 'UTF-8'); ?>" required>
            </div>
            <div class="form-group">
                <label for="phone_number">Phone Number:</label>
                <input type="text" name="phone_number" class="form-control" value="<?php echo htmlspecialchars($teacher['phone_number'], ENT_QUOTES, 'UTF-8'); ?>" required>
            </div>
            <div class="form-group">
                <label for="address">Address:</label>
                <textarea name="address" class="form-control" required><?php echo htmlspecialchars($teacher['address'], ENT_QUOTES, 'UTF-8'); ?></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
        </form>
    </div>
</body>
</html>
