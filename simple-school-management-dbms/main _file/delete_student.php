<?php
// Step 1: Include the database connection
require_once 'db_connection.php';

// Step 2: Check if the student ID is passed via the URL
if (isset($_GET['id'])) {
    $student_id = $_GET['id'];
    
    // Step 3: Prepare the SQL statement to delete the student by ID
    $sql = "DELETE FROM students WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $student_id);
    
    if ($stmt->execute()) {
        // Step 4: Redirect back to the student list after deletion
        header("Location: http://localhost:8080/school_management/students_list.php");
        exit();
    } else {
        echo "Error deleting record: " . $conn->error;
    }
    
    // Step 5: Close the statement and the connection
    $stmt->close();
    $conn->close();
} else {
    // If no ID is provided, redirect back to the student list
    header("Location: http://localhost:8080/school_management/students_list.php");
    exit();
}
?>
