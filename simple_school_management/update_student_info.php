<?php
session_start();
include 'db_connection.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id']; // Get the logged-in user's ID

// Collect form data
$name = $_POST['name'];
$father_name = $_POST['father_name'];
$mother_name = $_POST['mother_name'];
$present_address = $_POST['present_address'];
$permanent_address = $_POST['permanent_address'];
$phone_number = $_POST['phone_number'];
$department = $_POST['department'];
$session = $_POST['session'];
$student_id = $_POST['student_id'];

// Check if the student already exists in the database
$query = "SELECT * FROM students WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// If the student exists, update their information
if ($result->num_rows > 0) {
    // Update existing student details
    $update_query = "UPDATE students SET name = ?, father_name = ?, mother_name = ?, present_address = ?, permanent_address = ?, phone_number = ?, department = ?, session = ?, id = ? WHERE user_id = ?";
    $update_stmt = $conn->prepare($update_query);
    $update_stmt->bind_param("ssssssssii", $name, $father_name, $mother_name, $present_address, $permanent_address, $phone_number, $department, $session, $student_id, $user_id);
    
    if ($update_stmt->execute()) {
        echo "Information updated successfully.";
    } else {
        echo "Error updating information: " . $conn->error;
    }
} else {
    // If the student does not exist, insert new data
    $insert_query = "INSERT INTO students (user_id, name, father_name, mother_name, present_address, permanent_address, phone_number, department, session, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param("issssssssi", $user_id, $name, $father_name, $mother_name, $present_address, $permanent_address, $phone_number, $department, $session, $student_id);

    if ($insert_stmt->execute()) {
        echo "Information added successfully.";
    } else {
        echo "Error adding information: " . $conn->error;
    }
}

// Redirect back to the student dashboard
header("Location: student_dashboard.php");
exit();

?>
