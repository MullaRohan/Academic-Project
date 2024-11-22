
<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $role = $_POST['role'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hashing the password

    $sql = "INSERT INTO users (name, email, role, password) VALUES ('$name', '$email', '$role', '$password')";

    if ($conn->query($sql) === TRUE) {
        // Redirect to success page and pass role as a GET parameter
        header("Location: registration_success.php?role=$role");
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
