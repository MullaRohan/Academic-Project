<?php
require_once 'db_connection.php';

if (isset($_GET['id'])) {
    $teacher_id = $_GET['id'];

    // Prepare the SQL statement to delete the teacher
    $sql = "DELETE FROM teachers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $teacher_id);

    if ($stmt->execute()) {
        // Redirect to the teacher list after deletion
        header("Location: http://localhost:8080/school_management/teachers_list.php");
        exit();
    } else {
        echo "Error deleting record: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
} else {
    // If no ID is provided, redirect back to the teacher list
    header("Location: http://localhost:8080/school_management/teachers_list.php");
    exit();
}
?>
