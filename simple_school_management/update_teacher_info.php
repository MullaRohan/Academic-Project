
<?php
session_start();
include 'db_connection.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get form data
$name = $_POST['name'];
$department = $_POST['department'];
$phone_number = $_POST['phone_number'];
$address = $_POST['address'];
$user_id = $_SESSION['user_id'];

// Update teacher details in the teachers table
$query = "UPDATE teachers SET name = ?, department = ?, phone_number = ?, address = ? WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssi", $name, $department, $phone_number, $address, $user_id);

if ($stmt->execute()) {
    // Redirect back to the teacher dashboard or show success message
    header("Location: teacher_dashboard.php");
    exit();
} else {
    echo "Error updating record: " . $conn->error;
}
?>
