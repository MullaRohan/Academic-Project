<?php
include 'db_connection.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Set session variables for the logged-in user
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];  // Using the 'role' column from the 'users' table

            // Redirect to specific dashboard based on role
            if ($user['role'] == 'admin') {
                header("Location: /school_management/admin_dashboard.php");
            } elseif ($user['role'] == 'teacher') {
                header("Location: /school_management/teacher_dashboard.php");
            } elseif ($user['role'] == 'student') {
                header("Location: /school_management/student_dashboard.php");
            }
            exit();
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No user found with this email.";
    }
}
?>
